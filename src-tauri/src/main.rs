// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod arduino;
mod bt;
mod bt_listeners;
mod hardware;
mod music;
mod network;
mod settings;
mod signal_handler;
mod updater;

use std::sync::Arc;

use arduino::{get_available_boards, start_listen_to_board, stop_listen_to_board};
use bt::{
    connect_to_device, disconnect_from_device, get_bluetooth_status, get_known_devices,
    remove_device, start_discovery, stop_discovery, turn_off_bt, turn_on_bt,
};
use bt_listeners::{
    // start_device_found_listener,
    start_bt_listeners,
    // start_device_removed_listener
};
use bt_wrapper::adapter::adapter1::Adapter1;
use hardware::audio::sinks::{find_sinks, get_current_sink, set_active_sink};
use hardware::audio::{audio::change_volume, audio::get_curr_volume};
use music::{
    get_music_position, get_music_status, next_song, play_pause, prev_song, seek_song,
    start_music_status_listener, toggle_shuffle,
};
use network::{get_network_status, turn_off_wifi, turn_on_wifi};
use settings::{load_from_store, save_to_store};
use tauri::Manager;
use tauri_plugin_store::StoreBuilder;
use tokio::sync::{mpsc::Sender, Mutex};
use updater::check_for_update;

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

pub struct BluetoothManager {
    pub adapter1: Option<Adapter1>,
}

impl BluetoothManager {
    pub fn new() -> Self {
        let adapter1 = match Adapter1::new() {
            Ok(a) => Some(a),
            Err(_) => None,
        };
        Self { adapter1 }
    }
}

type SharedArduinoManager = Arc<Mutex<ArduinoManager>>;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tokio::main]
async fn main() {
    let arduino_manager = Arc::new(Mutex::new(ArduinoManager::new().await));
    let bluetooth_manager = BluetoothManager::new();

    tauri::Builder::default()
        .manage(arduino_manager)
        .manage(bluetooth_manager)
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            #[cfg(debug_assertions)] // remove on prod build
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }

            let store =
                StoreBuilder::new(app.handle(), "public/settings/settings.json".parse()?).build();
            app.manage(store);

            let app_handle = app.handle();
            let handle_clone = app_handle.clone();
            tauri::async_runtime::spawn(async move {
                start_bt_listeners(handle_clone).await;
                // start_device_found_listener(handle_clone).await;
            });
            let handle_clone = app_handle.clone();
            // tauri::async_runtime::spawn(async move {
            // start_device_removed_listener(handle_clone).await;
            // });
            tauri::async_runtime::spawn(async move {
                start_music_status_listener(app_handle).await;
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Music
            play_pause,
            next_song,
            prev_song,
            toggle_shuffle,
            seek_song,
            get_music_status,
            get_music_position,
            // Network
            get_network_status,
            turn_on_wifi,
            turn_off_wifi,
            // Bluetooth
            turn_on_bt,
            turn_off_bt,
            get_bluetooth_status,
            get_known_devices,
            start_discovery,
            stop_discovery,
            connect_to_device,
            disconnect_from_device,
            remove_device,
            // Arduino
            get_available_boards,
            start_listen_to_board,
            stop_listen_to_board,
            // Audio
            get_curr_volume,
            change_volume,
            find_sinks,
            get_current_sink,
            set_active_sink,
            // Settings
            save_to_store,
            load_from_store,
            check_for_update,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
