use core::str;
use std::io::Write;

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
    let (cancel_sender, mut cancel_receiver) = channel(1);
    let (cancel_sender2, mut cancel_receiver2) = channel(1);

    manager.cancel_sender = Some(cancel_sender.clone());
    manager.cancel_reader = Some(cancel_sender2.clone());

    spawn(async move {
        tokio::select! {
            _ = read_from_port(port, baud_rate, sender) => {},
            _ = cancel_receiver2.recv() => {
                println!("Reading thread stopped");
                return;
            }
        }
    });
    spawn(async move {
        loop {
            tokio::select! {
                Some(resp) = receiver.recv() => {
                    let parts = String::from_utf8(resp).unwrap_or("".to_string());
                    println!("Parts: {}", parts);
                    emit_to_frontend("arduino-message", parts, app_handle.clone());
                },
                    _ = cancel_receiver.recv() => {
                    println!("Sender thread stopped");
                    return;
                }
            }
        }
    });

    println!("Returning from ardu");

    Ok(())
}

#[tauri::command]
pub async fn stop_listen_to_board(state: State<'_, SharedArduinoManager>) -> Result<(), String> {
    let mut manager = state.lock().await;
    let cancel_str = "Exit_listener";

    let mut buffer = [0; 32];
    let mut cancel: &mut [u8] = &mut buffer;
    cancel.write(cancel_str.as_bytes()).unwrap();

    println!("Stopping arduino listener");
    if let Some(tx) = manager.cancel_sender.take() {
        let _ = tx.send(());
    }
    if let Some(tx) = manager.cancel_reader.take() {
        let _ = tx.send(());
    }
    Ok(())
}
