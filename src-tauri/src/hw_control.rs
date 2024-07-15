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
