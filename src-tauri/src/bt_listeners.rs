use std::collections::HashMap;

use bt_wrapper::{
    dbus_utils::parse_variant,
    root::object_manager::ObjectManager,
    utils::{get_address_from_path, get_path_from_address},
};
use serde::Serialize;
use tauri::Manager;

use crate::{
    bt::Device,
    signal_handler::{emit_bt_device_to_frontend, emit_to_frontend},
};

#[tauri::command]
pub async fn start_bt_listeners(app: tauri::AppHandle) {
    // TODO: add error handling
    let clone = app.clone();
    tauri::async_runtime::spawn(async move {
        start_device_found_listener(clone).await;
    });

    let clone = app.clone();
    tauri::async_runtime::spawn(async move {
        start_device_removed_listener(clone).await;
    });

    let clone = app.clone();
    tauri::async_runtime::spawn(async move {
        start_props_changed_listener(clone).await;
    });
}

async fn start_device_found_listener(app: tauri::AppHandle) {
    if let Ok(obj_mngr) =
        ObjectManager::new().map_err(|e| format!("Failed to create object manager: {}", e))
    {
        let (tx, mut rx) = tokio::sync::mpsc::channel(100);

        tokio::spawn(async move {
            let _ = obj_mngr.interfaces_added(tx, None).await;
        });

        while let Some(response) = rx.recv().await {
            for (_path, props) in response.1 {
                let mut device = Device::default();

                props
                    .get("Name")
                    .and_then(|prop| parse_variant::<String>(prop).ok())
                    .map(|prop| device.name = prop.to_string());

                props
                    .get("Address")
                    .and_then(|prop| parse_variant::<String>(prop).ok())
                    .map(|prop| device.address = prop.to_string());

                props
                    .get("Paired")
                    .and_then(|prop| parse_variant::<bool>(prop).ok())
                    .map(|prop| device.paired = *prop);

                props
                    .get("Connected")
                    .and_then(|prop| parse_variant::<bool>(prop).ok())
                    .map(|prop| device.connected = *prop);

                props
                    .get("Icon")
                    .and_then(|prop| parse_variant::<String>(prop).ok())
                    .map(|prop| device.icon = prop.to_string());

                emit_bt_device_to_frontend("device-found", &device, &app.clone());

                let app_clone = app.clone();
                tokio::spawn(async move {
                    start_device_listener(&app_clone, &device.address).await;
                });
            }
        }
    }
}

async fn start_device_removed_listener(app: tauri::AppHandle) {
    if let Ok(obj_mngr) =
        ObjectManager::new().map_err(|e| format!("Failed to create object manager: {}", e))
    {
        let (tx, mut rx) = tokio::sync::mpsc::channel(100);

        tokio::spawn(async move {
            let _ = obj_mngr.interfaces_removed(tx, None).await;
        });

        while let Some(response) = rx.recv().await {
            let path = response.0;

            if path.starts_with("/org/bluez/hci0/dev_") {
                emit_to_frontend(
                    "bt-device-removed",
                    get_address_from_path(path.trim().into()).unwrap_or("".to_string()),
                    app.clone(),
                );
            }
        }
    }
}

async fn start_props_changed_listener(app: tauri::AppHandle) {
    if let Ok(props) = bt_wrapper::properties::Properties::new("/org/bluez/hci0")
        .map_err(|e| format!("Failed to create properties: {}", e))
    {
        println!("Starting props changed listener");
        let (tx, mut rx) = tokio::sync::mpsc::channel(100);

        tokio::spawn(async move {
            let _ = props.properties_changed(tx, None).await;
        });

        while let Some(response) = rx.recv().await {
            if let Some(sender) = response.get("Sender") {
                match sender.as_str() {
                    "org.bluez.Adapter1" => emit_discovery_status(&response, &app),
                    &_ => {
                        println!("Not sure what to do: {:?}", response)
                    }
                }
            }
        }
    }
}

#[derive(Serialize, Debug, Default, Clone)]
struct DeviceUpdate {
    device_addr: String,
    connected: bool,
}

// TODO: figure out a way to easily stop this fn
async fn start_device_listener(app: &tauri::AppHandle, device_addr: &str) {
    if device_addr.is_empty() {
        return;
    }

    if let Ok(device_props) = bt_wrapper::properties::Properties::new(&get_path_from_address(
        device_addr,
        "/org/bluez/hci0",
    ))
    .map_err(|e| {
        format!(
            "Failed to create properties for device: {}, cause: {}",
            device_addr, e
        )
    }) {
        let (tx, mut rx) = tokio::sync::mpsc::channel(100);

        tokio::spawn(async move {
            let _ = device_props.properties_changed(tx, None).await;
        });

        while let Some(response) = rx.recv().await {
            if let Some(connected) = response.get("Connected") {
                let dev_update = DeviceUpdate {
                    device_addr: device_addr.to_string(),
                    connected: connected.contains("true"),
                };
                let _ = app.emit_all("device-update", dev_update);
            }
        }
    }
}

// fn emit_device_update(dev_update: &DeviceUpdate, app: &tauri::AppHandle) {
//     let _ = app.emit_all("device-update", dev_update);
// }

fn emit_discovery_status(resp: &HashMap<String, String>, app: &tauri::AppHandle) {
    if let Some(discovering) = resp.get("Discovering") {
        emit_to_frontend(
            "bt-discovering",
            discovering.contains("true").to_string(),
            app.clone(),
        )
    }
}
