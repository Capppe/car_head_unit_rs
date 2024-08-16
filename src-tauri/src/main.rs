// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod arduino;
mod bt;
mod bt_listeners;
mod hw_control;
mod music;
mod network;
mod signal_handler;

use std::sync::Arc;

use arduino::{get_available_boards, start_listen_to_board, stop_listen_to_board};
use bt::{
    connect_to_device, disconnect_from_device, get_bluetooth_status, get_known_devices,
    start_discovery, stop_discovery,
};
use bt_listeners::start_device_found_listener;
use bt_wrapper::bluetooth::Bluetooth;
use hw_control::{change_volume, get_curr_volume};
use music::{
    get_music_position, get_music_status, next_song, play_pause, prev_song, seek_song,
    start_music_status_listener,
};
use network::get_network_status;
use tauri::Manager;
use tokio::sync::{mpsc::Sender, oneshot, Mutex};

pub struct BluetoothManager {
    pub bt: Bluetooth,
    pub cancel_sender: Option<oneshot::Sender<()>>,
}

impl BluetoothManager {
    async fn new() -> Self {
        let bt = Bluetooth::new().await.unwrap();
        BluetoothManager {
            bt,
            cancel_sender: None,
        }
    }
}

pub struct ArduinoManager {
    pub cancel_sender: Option<Sender<()>>,
    pub cancel_reader: Option<Sender<()>>,
}

impl ArduinoManager {
    async fn new() -> Self {
        Self {
            cancel_sender: None,
            cancel_reader: None,
        }
    }
}

type SharedBluetoothManager = Arc<Mutex<BluetoothManager>>;
type SharedArduinoManager = Arc<Mutex<ArduinoManager>>;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tokio::main]
async fn main() {
    let bluetooth_manager = Arc::new(Mutex::new(BluetoothManager::new().await));
    let arduino_manager = Arc::new(Mutex::new(ArduinoManager::new().await));

    tauri::Builder::default()
        .manage(bluetooth_manager)
        .manage(arduino_manager)
        .setup(|app| {
            #[cfg(debug_assertions)] // remove on prod build
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }
            let app_handle = app.handle();
            let handle_clone = app_handle.clone();
            tauri::async_runtime::spawn(async move {
                start_device_found_listener(handle_clone).await;
            });
            tauri::async_runtime::spawn(async move {
                start_music_status_listener(app_handle).await;
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            play_pause,
            next_song,
            prev_song,
            seek_song,
            get_music_status,
            get_music_position,
            get_network_status,
            get_bluetooth_status,
            get_known_devices,
            start_discovery,
            stop_discovery,
            connect_to_device,
            disconnect_from_device,
            get_curr_volume,
            change_volume,
            get_available_boards,
            start_listen_to_board,
            stop_listen_to_board,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
