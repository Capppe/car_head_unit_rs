use std::sync::Mutex;

use tauri::{api::path::app_data_dir, AppHandle, Wry};
use tauri_plugin_store::{Store, StoreBuilder};

#[tauri::command]
pub fn load_from_store(app: AppHandle, key: String) -> Result<String, String> {
    if let Some(path) = app_data_dir(&app.config()) {
        let path = path.join("settings/settings.json");
        let mut store = StoreBuilder::new(app, path).build();
        if let Err(e) = store.load() {
            return Err(format!("Failed to load() store: {}", e));
        }

        if let Some(val) = store.get(key.clone()) {
            Ok(val.to_string())
        } else {
            Err(format!("Failed to get value for key: {}", key))
        }
    } else {
        Err(format!("Failed to open app_data_dir"))
    }
}

#[tauri::command]
pub fn save_to_store(
    state: tauri::State<'_, Mutex<Store<Wry>>>,
    key: String,
    value: String,
) -> Result<(), String> {
    let mut store = state
        .lock()
        .map_err(|e| format!("Failed to get lock on store: {}", e))?;

    store
        .insert(key.clone(), value.clone().into())
        .map_err(|e| format!("Failed to persist setting: {}-{}, cause: {}", key, value, e))?;

    store
        .save()
        .map_err(|e| format!("Failed to save store: {}", e))
}
