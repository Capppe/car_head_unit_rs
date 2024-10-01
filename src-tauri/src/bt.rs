use bt_wrapper::{
    adapter::adapter1::Adapter1, dbus_utils::parse_variant, devices::device::device1::Device1,
    root::object_manager::ObjectManager, utils::get_path_from_address, Properties,
};
use serde::Serialize;
use tauri::State;

use crate::BluetoothManager;

#[derive(Serialize)]
pub struct BluetoothStatus {
    address: String,
    address_type: String,
    alias: String,
    class: String,
    discoverable: bool,
    discoverable_timeout: i32,
    discovering: bool,
    manufacturer: String,
    modalias: String,
    name: String,
    pairable: bool,
    pairable_timeout: i32,
    powered: bool,
    power_state: String,
    roles: Vec<String>,
    uuids: Vec<String>,
    version: i32,
}

#[tauri::command]
pub fn get_bluetooth_status(state: State<'_, BluetoothManager>) -> Result<BluetoothStatus, String> {
    let adapter = match &state.adapter1 {
        Some(a) => a,
        None => return Err(format!("Failed to initialize adapter")),
    };

    let version = adapter.get_property("Version").unwrap_or(0);
    let uuids = adapter.get_property("UUIDs").unwrap_or(Vec::new());
    let roles = adapter.get_property("Roles").unwrap_or(Vec::new());
    let power_state = adapter.get_property("PowerState").unwrap_or(String::new());
    let powered = adapter.get_property("Powered").unwrap_or(false);
    let pairable_timeout = adapter.get_property("PairableTimeout").unwrap_or(0);
    let pairable = adapter.get_property("Pairable").unwrap_or(false);
    let name = adapter.get_property("Name").unwrap_or(String::new());
    let modalias = adapter.get_property("Modalias").unwrap_or(String::new());
    let manufacturer = adapter
        .get_property("Manufacturer")
        .unwrap_or(String::new());
    let discovering = adapter.get_property("Discovering").unwrap_or(false);
    let discoverable_timeout = adapter.get_property("DiscoverableTimeout").unwrap_or(0);
    let discoverable = adapter.get_property("Discoverable").unwrap_or(false);
    let class = adapter.get_property("Class").unwrap_or(String::new());
    let alias = adapter.get_property("Alias").unwrap_or(String::new());
    let address_type = adapter.get_property("AddressType").unwrap_or(String::new());
    let address = adapter.get_property("Address").unwrap_or(String::new());

    Ok(BluetoothStatus {
        address,
        address_type,
        alias,
        class,
        discoverable,
        discoverable_timeout,
        discovering,
        manufacturer,
        modalias,
        name,
        pairable,
        pairable_timeout,
        powered,
        power_state,
        roles,
        uuids,
        version,
    })
}

#[derive(Serialize, Debug, Default, Clone)]
pub struct Device {
    pub name: String,
    pub address: String,
    pub paired: bool,
    pub connected: bool,
    pub icon: String,
}

#[tauri::command]
pub fn get_known_devices() -> Result<Vec<Device>, String> {
    let obj_mngr =
        ObjectManager::new().map_err(|e| format!("Failed to create object manager, {}", e))?;
    let mut devs = Vec::new();

    let objects = obj_mngr
        .get_managed_objects()
        .map_err(|e| format!("Failed to get managed objects: {}", e))?;

    for (path, properties) in objects {
        if !path.starts_with("/org/bluez/hci0/dev_") {
            continue;
        }

        for (iface, props) in properties {
            if !iface.starts_with("org.bluez.Device") {
                continue;
            }

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

            devs.push(device);
        }
    }

    Ok(devs)
}

#[tauri::command]
pub async fn start_discovery(
    _duration: u64,
    state: State<'_, BluetoothManager>,
) -> Result<(), String> {
    if let Some(adapter) = &state.adapter1 {
        adapter
            .start_discovery()
            .map_err(|e| format!("Failed to start discovery: {}", e))
    } else {
        Err(format!("Failed to create Adapter"))
    }
}

#[tauri::command]
pub async fn stop_discovery(state: State<'_, BluetoothManager>) -> Result<(), String> {
    if let Some(adapter) = &state.adapter1 {
        adapter
            .stop_discovery()
            .map_err(|e| format!("Failed to stop discovery: {}", e))
    } else {
        Err(format!("Failed to create Adapter"))
    }
}

#[tauri::command]
pub async fn remove_device(
    address: String,
    state: State<'_, BluetoothManager>,
) -> Result<(), String> {
    if let Some(adapter) = &state.adapter1 {
        adapter.remove_device(get_path_from_address(&address, "/org/bluez/hci0").into())?
    }
    Err(format!("Failed to create Adapter"))
}

#[tauri::command]
pub async fn connect_to_device(address: String) -> Result<(), String> {
    if let Ok(device) = Device1::new(address.as_str()) {
        device.connect().map_err(|e| {
            format!(
                "Failed to connect to device with address {}, cause: {}",
                address, e
            )
        })
    } else {
        Err(format!(
            "Failed to create a device with address: {}",
            address
        ))
    }
}

#[tauri::command]
pub async fn disconnect_from_device(address: String) -> Result<(), String> {
    if let Ok(device) = Device1::new(&address) {
        device.disconnect().map_err(|e| {
            format!(
                "Failed to disconnect from device with address: {}, cause: {}",
                address, e
            )
        })
    } else {
        Err(format!(
            "Failed to create a device with address: {}",
            address
        ))
    }
}

// TODO: add listener / emit on power on/off
#[tauri::command]
pub async fn turn_off_bt() -> Result<(), String> {
    if let Ok(adapter) = Adapter1::new() {
        adapter.set_property("Powered", false)
    } else {
        Err(format!("Failed to create adapter"))
    }
}

#[tauri::command]
pub async fn turn_on_bt() -> Result<(), String> {
    if let Ok(adapter) = Adapter1::new() {
        adapter.set_property("Powered", true)
    } else {
        Err(format!("Failed to create adapter"))
    }
}
