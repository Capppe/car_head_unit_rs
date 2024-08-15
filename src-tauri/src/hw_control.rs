use std::process::Command;

#[tauri::command]
pub fn change_volume(val: String) {
    let cmd = get_audio_command();

    if cmd == "amixer" {
        let _ = Command::new("amixer")
            .arg("set")
            .arg("Master")
            .arg(format!("{}%", val))
            .output()
            .expect("Cant change volume(amixer)");
    } else if cmd == "pactl" {
        let _ = Command::new("pactl")
            .arg("set-sink-volume")
            .arg("@DEFAULT_SINK@")
            .arg(format!("{}%", val))
            .output()
            .expect("Cant change volume(pactl)");
    }
}

#[tauri::command]
pub fn get_curr_volume() -> Result<String, String> {
    let cmd = get_audio_command();

    let vol = match cmd.as_str() {
        "pactl" => Command::new("pactl")
            .arg("get-sink-volume")
            .arg("@DEFAULT_SINK@")
            .output()
            .map_err(|e| format!("Failed to execute pactl command: {}", e))?,

        _ => return Err("Unsupported command".to_string()),
    };

    if !vol.status.success() {
        return Err(format!(
            "Command execution failed with exit code: {}",
            vol.status.code().unwrap_or(-1)
        ));
    }

    let output = String::from_utf8(vol.stdout)
        .map_err(|e| format!("Failed to convert output to string: {}", e))?;

    for line in output.lines() {
        if line.trim().starts_with("Volume:") {
            if let Some(volume) = line.split_whitespace().nth(4) {
                return Ok(volume.to_string());
            }
        }
    }

    Err("Cant get volume".to_string())
}

fn get_audio_command() -> String {
    let mut pulseaudio = Command::new("pactl");
    let mut amixer = Command::new("amixer");
    let mut cmd = String::from("");

    match amixer.output() {
        Ok(_) => cmd = "amixer".to_string(),
        Err(_) => {}
    };

    match pulseaudio.output() {
        Ok(_) => cmd = "pactl".to_string(),
        Err(_) => {}
    }

    return cmd;
}
