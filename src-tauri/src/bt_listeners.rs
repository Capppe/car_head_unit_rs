use bt_wrapper::{bluetooth::Bluetooth, bt_listener::Listener};

use crate::signal_handler::emit_to_frontend;

#[tauri::command]
pub async fn start_device_found_listener(app: tauri::AppHandle) {
    let bt = Bluetooth::new(None).await;
    let listener = Listener::new(bt.unwrap()).await;
    let (sender, receiver) = async_channel::bounded(1);

    let bt_listener = listener.unwrap();

    tokio::spawn(async move {
        let _ = bt_listener.start_device_added_listener(sender).await;
    });

    while let Ok(response) = receiver.recv().await {
        emit_to_frontend("device-found", response, app.clone());
    }
}
