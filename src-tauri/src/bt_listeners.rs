use bt_wrapper::root::object_manager::ObjectManager;

use crate::signal_handler::emit_to_frontend;

#[tauri::command]
pub async fn start_device_found_listener(app: tauri::AppHandle) {
    if let Ok(obj_mngr) =
        ObjectManager::new().map_err(|e| format!("Failed to create object manager: {}", e))
    {
        let (tx, mut rx) = tokio::sync::mpsc::channel(100);

        tokio::spawn(async move {
            let _ = obj_mngr.interfaces_added(tx, None).await;
        });

        while let Some(response) = rx.recv().await {
            println!("Device? : {:?}", response);
            // emit_to_frontend("device-found", response, app.clone());
        }
    }
}
