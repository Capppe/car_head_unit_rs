use std::time::Duration;

use bt_wrapper::{bluetooth::Bluetooth, bt_status::Status, device::Device};
use tauri::State;
use tokio::sync::oneshot;

use crate::SharedBluetoothManager;

#[tauri::command]
pub async fn get_bluetooth_status() -> Result<Status, String> {
    let bt = Bluetooth::new().await;

    let bluetooth = bt.unwrap();

    match bluetooth.get_status().await {
        Ok(status) => Ok(status),
        Err(_) => Err("".to_string()),
    }
}

#[tauri::command]
pub async fn get_known_devices() -> Result<Vec<Device>, String> {
    let bt = Bluetooth::new().await;
    let mut devs = Vec::new();

    let bluetooth = bt.unwrap();

    match bluetooth.get_known_devices().await {
        Ok(devices) => {
            for device in devices {
                devs.push(device);
            }
        }
        Err(_) => (),
    }

    return Ok(devs);
}

#[tauri::command]
pub async fn start_discovery(
    duration: u64,
    state: State<'_, SharedBluetoothManager>,
) -> Result<(), String> {
    let mut manager = state.lock().await;

    let bluetooth = &manager.bt;
    let bt_clone = bluetooth.clone();
    let (tx, rx) = oneshot::channel();

    manager.cancel_sender = Some(tx);

    tokio::spawn(async move {
        let discovery_future = bt_clone.start_discovery(Duration::from_secs(duration));

        tokio::select! {
            _ = discovery_future => { }
            _ = rx => { }
        }
    });
    Ok(())
}

#[tauri::command]
pub async fn stop_discovery(state: State<'_, SharedBluetoothManager>) -> Result<(), String> {
    let mut manager = state.lock().await;
    let bluetooth = &manager.bt;

    let bt_clone = bluetooth.clone();

    if let Some(tx) = manager.cancel_sender.take() {
        println!("Stopping scan");
        let _ = tx.send(());
    }

    tokio::spawn(async move {
        let _ = bt_clone.stop_discovery().await;
    });

    Ok(())
}

#[tauri::command]
pub async fn connect_to_device(
    address: String,
    state: State<'_, SharedBluetoothManager>,
) -> Result<String, ()> {
    let manager = state.lock().await;
    let bluetooth = &manager.bt;
    let bt_clone = bluetooth.clone();

    let result = bt_clone
        .connect(address, tokio::time::Duration::from_secs(10))
        .await;

    match result {
        Ok(_) => Ok("connected".to_string()),
        Err(_) => Err(()),
    }
}

#[tauri::command]
pub async fn disconnect_from_device(
    address: String,
    state: State<'_, SharedBluetoothManager>,
) -> Result<String, ()> {
    let manager = state.lock().await;
    let bluetooth = &manager.bt;
    let bt_clone = bluetooth.clone();

    let result = bt_clone
        .disconnect(address, tokio::time::Duration::from_secs(10))
        .await;

    match result {
        Ok(_) => Ok("disconnected".to_string()),
        Err(_) => Err(()),
    }
}
