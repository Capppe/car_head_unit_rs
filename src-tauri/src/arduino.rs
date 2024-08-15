use core::str;

use serde::{Deserialize, Serialize};

use serial_rs::{ports::Port, ports_io::read_from_port};
use tauri::async_runtime::spawn;
use tauri::State;
use tokio::process::Command;
use tokio::sync::mpsc::channel;

use crate::signal_handler::emit_to_frontend;
use crate::SharedArduinoManager;

#[derive(Debug, Deserialize, Serialize)]
pub struct DetectedPorts {
    detected_ports: Vec<PortInfo>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct PortInfo {
    matching_boards: Option<Vec<Board>>,
    port: Port,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Board {
    name: Option<String>,
    fqbn: Option<String>,
    port: Option<Port>,
}

impl Board {
    pub fn from(name: String, fqbn: String, port: Port) -> Self {
        Self {
            name: Some(name),
            fqbn: Some(fqbn),
            port: Some(port),
        }
    }
}

#[tauri::command]
pub async fn get_available_boards() -> Result<Vec<Board>, String> {
    let mut boards_vec: Vec<Board> = Vec::new();
    let a_cli_output = Command::new("arduino-cli")
        .arg("board")
        .arg("list")
        .arg("--json")
        .output()
        .await
        .expect("Failed to run arduino-cli");

    if a_cli_output.status.success() {
        let boards_json: DetectedPorts =
            serde_json::from_str(&String::from_utf8_lossy(&a_cli_output.stdout))
                .expect("Failed to parse devices");

        for ports in boards_json.detected_ports {
            if let Some(boards) = ports.matching_boards {
                for board in boards {
                    let new_board = Board::from(
                        board.name.unwrap_or("".to_string()),
                        board.fqbn.unwrap_or("".to_string()),
                        ports.port.clone(),
                    );
                    boards_vec.push(new_board);
                }
            }
        }
    }

    return Ok(boards_vec);
}

#[tauri::command]
pub async fn start_listen_to_board(
    port: Port,
    baud_rate: u32,
    state: State<'_, SharedArduinoManager>,
    app_handle: tauri::AppHandle,
) -> Result<(), String> {
    let mut manager = state.lock().await;
    let (sender, mut receiver) = channel(1);

    manager.cancel_sender = Some(sender.clone());

    spawn(async move {
        let _ = read_from_port(port, baud_rate, sender).await;
    });

    while let Some(resp) = receiver.recv().await {
        let parts = String::from_utf8(resp);
        println!("Pars: {:?}", parts);
        emit_to_frontend(
            "arduino-message",
            parts.unwrap_or("".to_string()),
            app_handle.clone(),
        );
    }

    println!("Returning from ardu");

    Ok(())
}

#[tauri::command]
pub async fn stop_listen_to_board(state: State<'_, SharedArduinoManager>) -> Result<(), String> {
    let mut manager = state.lock().await;

    println!("Stopping arduino listener");
    if let Some(tx) = manager.cancel_sender.take() {
        let _ = tx.send(Vec::new());
    }
    Ok(())
}
