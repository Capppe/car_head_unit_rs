use std::process::Command;

#[tauri::command]
pub fn get_network_status() -> Result<String, String> {
    let output = Command::new("nmcli")
        .arg("-t")
        .arg("-f")
        .arg("STATE")
        .arg("general")
        .output()
        .expect("Failed to execute nmcli");

    if output.status.success() {
        let output_str = String::from_utf8_lossy(&output.stdout);
        Ok(output_str.to_string())
    } else {
        Err("".to_string())
    }
}
