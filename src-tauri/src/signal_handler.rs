use tauri::Manager;

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
