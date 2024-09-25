use std::collections::HashMap;

use tauri::Manager;

use crate::music::MusicStatus;

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

#[tauri::command]
pub fn emit_music_status_to_frontend(
    sig_name: &str,
    msg: HashMap<String, String>,
    app: tauri::AppHandle,
) {
    app.emit_all(sig_name, MusicStatus::new()).unwrap();
}
