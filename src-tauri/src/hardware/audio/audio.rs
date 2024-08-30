use std::process::Command;

#[tauri::command]
pub fn change_volume(val: String) -> Result<(), String> {
    match get_audio_command()? {
        Some(cmd) if cmd == "amixer" => {
            let _ = Command::new("amixer")
                .arg("set")
                .arg("Master")
                .arg(format!("{}%", val))
                .output()
                .map_err(|e| format!("Failed to change volume with amixer: {e}"));
        }
        Some(cmd) if cmd == "pactl" => {
            let _ = Command::new("pactl")
                .arg("set-sink-volume")
                .arg("@DEFAULT_SINK@")
                .arg(format!("{}%", val))
                .output()
                .map_err(|e| format!("Failed to change volume with pactl: {e}"));
        }
        _ => return Err("Unsupported command".to_string()),
    }

    Ok(())
}

#[tauri::command]
pub fn get_curr_volume() -> Result<String, String> {
    let cmd = get_audio_command()?.ok_or_else(|| "No suitable audio command found".to_string())?;

    let output = Command::new(&cmd)
        .arg(if cmd == "pactl" {
            "get-sink-volume"
        } else {
            return Err("Unsupported command".to_string());
        })
        .arg("@DEFAULT_SINK@")
        .output()
        .map_err(|e| format!("Failed to execute {} command: {}", cmd, e))?;

    if !output.status.success() {
        return Err(format!(
            "Command execution failed with exit code: {}",
            output.status.code().unwrap_or(-1)
        ));
    }

    let output_str = String::from_utf8(output.stdout)
        .map_err(|e| format!("Failed to convert output to string: {}", e))?;

    for line in output_str.lines() {
        if let Some(volume) = line
            .trim()
            .split_whitespace()
            .nth(4)
            .filter(|&word| word.contains('%'))
        {
            return Ok(volume.to_string());
        }
    }

    Err("Cannot get volume".to_string())
}

fn get_audio_command() -> Result<Option<String>, String> {
    if Command::new("amixer").output().is_ok() {
        return Ok(Some("amixer".to_string()));
    }

    if Command::new("pactl").output().is_ok() {
        return Ok(Some("pactl".to_string()));
    }

    return Err("No audio command found!".to_string());
}
