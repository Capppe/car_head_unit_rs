use std::process::Command;

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
}

#[tauri::command]
pub fn find_sinks() -> Result<Vec<AudioSink>, String> {
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

    let devices: Vec<AudioSink> = match serde_json::from_str(&data) {
        Ok(d) => d,
        Err(_e) => Vec::new(),
    };

    return Ok(devices);
}
