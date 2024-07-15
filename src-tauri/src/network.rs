use std::process::Command;

use serde::Serialize;

#[derive(Default, Debug, Serialize)]
pub struct NetworkStatus {
    connected: Option<bool>,
    dev_name: Option<String>,
}

impl NetworkStatus {
    fn new() -> Self {
        Self {
            connected: Some(false),
            dev_name: Some("Unknown".to_string()),
        }
    }
}

#[tauri::command]
pub fn get_network_status() -> NetworkStatus {
    let mut status = NetworkStatus::new();
    let connected_output = Command::new("nmcli")
        .arg("-t")
        .arg("-f")
        .arg("STATE")
        .arg("general")
        .output()
        .expect("Failed to execute nmcli");

    let dev_name_output = Command::new("nmcli")
        .arg("-t")
        .arg("-f")
        .arg("NAME")
        .arg("c")
        .arg("show")
        .arg("--active")
        .output()
        .expect("Failed to execute nmcli");

    if connected_output.status.success() {
        let output_str = String::from_utf8_lossy(&connected_output.stdout);
        let c = output_str.trim() == "connected";

        if c {
            status.connected = Some(true);
        }
    }

    if dev_name_output.status.success() {
        let output_str = String::from_utf8_lossy(&dev_name_output.stdout);
        let n = output_str.trim().split("\n").next();

        if let Some(name) = n {
            status.dev_name = Some(name.to_string());
        }
    }

    return status;
}
