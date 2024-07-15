// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod bt;
mod hw_control;
mod network;

use bt::{get_bluetooth_status, get_known_devices};
use hw_control::change_volume;
use network::get_network_status;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_network_status,
            get_bluetooth_status,
            get_known_devices,
            change_volume,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
