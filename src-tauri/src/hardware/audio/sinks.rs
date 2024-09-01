use std::{fmt::write, process::Command};

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct AudioSink {
    index: u32,
    name: String,
    description: String,
}

impl AudioSink {
    pub fn new(index: u32, name: String, description: String) -> Self {
        Self {
            index,
            name,
            description,
        }
    }

    fn get_available_sinks() -> Result<Vec<Self>, String> {
        let data = Command::new("pactl")
            .arg("-f")
            .arg("json")
            .arg("list")
            .arg("sinks")
            .output()
            .map_err(|e| format!("Failed to execute pactl command: {e}"))?;

        if !data.status.success() {
            return Err(format!(
                "Command execution failed with exit code: {}",
                data.status.code().unwrap_or(-1)
            ));
        }

        let data = String::from_utf8(data.stdout)
            .map_err(|e| format!("Failed to convert sink-data to string: {}", e))?;

        match serde_json::from_str(&data) {
            Ok(d) => Ok(d),
            Err(e) => Err(e.to_string()),
        }
    }

    fn get_current_sink() -> Result<Self, String> {
        let sinks = AudioSink::get_available_sinks()
            .map_err(|e| format!("Failed to get available sinks: {e}"))?;

        let curr_sink = Command::new("pactl")
            .arg("get-default-sink")
            .output()
            .map_err(|e| format!("Failed to execute pactl command: {e}"))?;

        if !curr_sink.status.success() {
            return Err(format!(
                "Failed to get default sink, exit code: {}",
                curr_sink.status.code().unwrap_or(-1)
            ));
        }

        let curr_sink_name = String::from_utf8(curr_sink.stdout)
            .map_err(|e| format!("Failed to convert curr-sink to string: {}", e))?;

        for sink in sinks {
            if sink.name.trim() == curr_sink_name.trim() {
                return Ok(sink);
            }
        }

        Err("Failed to find current sink".to_string())
    }

    fn set_active_sink(sink_name: String) -> Result<(), String> {
        let _ = Command::new("pactl")
            .arg("set-default-sink")
            .arg(sink_name)
            .output()
            .map_err(|e| format!("Failed to set default sink: {}", e));

        Ok(())
    }
}

#[tauri::command]
pub fn find_sinks() -> Result<Vec<AudioSink>, String> {
    AudioSink::get_available_sinks()
}

#[tauri::command]
pub fn get_current_sink() -> Result<AudioSink, String> {
    AudioSink::get_current_sink()
}

#[tauri::command]
pub fn set_active_sink(name: String) -> Result<(), String> {
    AudioSink::set_active_sink(name)
}
