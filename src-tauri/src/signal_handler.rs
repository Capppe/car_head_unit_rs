use tauri::Manager;

use crate::{bt::Device, music::MusicStatus};

#[derive(Clone, serde::Serialize)]
pub struct Payload {
    message: String,
}

#[tauri::command]
pub fn emit_to_frontend(sig_name: &str, msg: String, app: tauri::AppHandle) {
    app.emit_all(
        sig_name,
        Payload {
            message: msg.into(),
        },
    )
    .unwrap();
}

pub fn emit_bt_device_to_frontend(sig_name: &str, msg: &Device, app: &tauri::AppHandle) {
    app.emit_all(sig_name, msg).unwrap();
}

#[tauri::command]
pub fn emit_music_status_to_frontend(sig_name: &str, msg: MusicStatus, app: tauri::AppHandle) {
    app.emit_all(sig_name, msg).unwrap();
}
