use core::str;

use serde::{Deserialize, Serialize};

use serial_rs::ports::PortType;
use serial_rs::structs::SerialDeviceInfo;
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
    is_arduino: Option<bool>,
}

impl Board {
    pub fn from(name: String, fqbn: String, port: Port, is_arduino: bool) -> Self {
        Self {
            name: Some(name),
            fqbn: Some(fqbn),
            port: Some(port),
            is_arduino: Some(is_arduino),
        }
    }

    pub fn from_udev(udev_info: SerialDeviceInfo) -> Self {
        let mut port = Port::new();
        port.name = udev_info.ID_MODEL;
        port.label = udev_info.DEVNAME;
        port.s_type = match udev_info.ID_BUS.unwrap().as_str() {
            "usb" => Some(PortType::USB),
            _ => Some(PortType::Unknown),
        };
        Self {
            name: udev_info.ID_MODEL_FROM_DATABASE,
            fqbn: udev_info.ID_VENDOR_FROM_DATABASE,
            port: Some(port),
            is_arduino: Some(false),
        }
    }
}

async fn get_arudino_boards() -> Vec<Board> {
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
                        true,
                    );
                    boards_vec.push(new_board);
                }
            }
        }
    }

    return boards_vec;
}

async fn get_esp_boards() -> Vec<Board> {
    let mut boards_vec: Vec<Board> = Vec::new();
    let available_ports = serial_rs::ports::get_all_available_ports().await;

    for port in available_ports {
        if port.s_type != Some(PortType::USB) {
            continue;
        }
        if let Some(path) = port.name {
            let udevadm_output = std::process::Command::new("udevadm")
                .arg("info")
                .arg("--json=short")
                .arg("--no-pager")
                .arg("-n")
                .arg(path.to_string())
                .output()
                .expect("Failed to run udevadm");

            if udevadm_output.status.success() {
                let boards_json: SerialDeviceInfo =
                    serde_json::from_str(&String::from_utf8_lossy(&udevadm_output.stdout))
                        .expect("Failed to parse devices");

                boards_vec.push(Board::from_udev(boards_json));
            }
        }
    }

    return boards_vec;
}

#[tauri::command]
pub async fn get_available_boards() -> Result<Vec<Board>, String> {
    let mut boards: Vec<Board> = Vec::new();
    let mut arduino_boards = get_arudino_boards().await;
    let mut esp_boards = get_esp_boards().await;

    boards.append(&mut arduino_boards);
    boards.append(&mut esp_boards);

    // println!("Boards: {:?}", boards);

    Ok(boards)
}

#[tauri::command]
pub async fn start_listen_to_board(
    port: Port,
    baud_rate: u32,
    state: State<'_, SharedArduinoManager>,
    app_handle: tauri::AppHandle,
) -> Result<(), String> {
    let (sender, mut receiver) = channel(1);
    let (cancel_sender, mut cancel_receiver) = channel(1);
    let (cancel_sender2, mut cancel_receiver2) = channel(1);

    {
        let mut manager = state.lock().await;
        manager.cancel_sender = Some(cancel_sender.clone());
        manager.cancel_reader = Some(cancel_sender2.clone());
    }

    let (error_sender, mut error_receiver) = channel(1);

    let handle = spawn(async move {
        tokio::select! {
            res = read_from_port(port, baud_rate, sender) => {
                match res {
                    Ok(()) => {println!("Ok")},
                    Err(e) => {
                        let _ = error_sender.send(e.raw_os_error()).await;
                    }
                }
            },
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
                    if parts != "\n" {
                        println!("Parts: {}", parts);
                        emit_to_frontend("arduino-message", parts, app_handle.clone());
                    }
                },
                    _ = cancel_receiver.recv() => {
                    println!("Sender thread stopped");
                    return;
                }
            }
        }
    });

    if let Some(err) = error_receiver.recv().await {
        println!("Err occurred: {:?}", err);
        if err == Some(16) {
            return Err("Device busy".to_string());
        }
    }

    let _ = handle.await;

    println!("Returning from ardu");

    Ok(())
}

#[tauri::command]
pub async fn stop_listen_to_board(state: State<'_, SharedArduinoManager>) -> Result<(), String> {
    let mut manager = state.lock().await;

    println!("Stopping arduino listener");
    if let Some(tx) = manager.cancel_sender.take() {
        let _ = tx.send(()).await;
    }
    if let Some(tx) = manager.cancel_reader.take() {
        let _ = tx.send(()).await;
    }
    Ok(())
}
