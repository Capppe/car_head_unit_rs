use bt_wrapper::{bluetooth::Bluetooth, bt_status::Status, device::Device};

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
