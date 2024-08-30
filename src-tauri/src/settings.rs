use std::{
    fs::{self, File},
    io::BufReader,
    path::PathBuf,
};

use serde::{Deserialize, Serialize};
use tauri::AppHandle;

//TODO rewrite maybe

#[derive(Debug, Serialize, Deserialize)]
pub struct Setting {
    name: String,
    value: String,
}

#[derive(Debug, Deserialize)]
pub struct SettingsWrapper {
    Settings: Vec<Setting>,
}

impl Setting {
    pub fn new(name: String, value: String) -> Self {
        Self { name, value }
    }
}

fn find_setting(path: &PathBuf, needle: &str) -> Result<String, ()> {
    let file = match File::open(path) {
        Ok(f) => f,
        Err(_) => return Err(()),
    };
    let reader = BufReader::new(file);

    let settings: SettingsWrapper = match serde_json::from_reader(reader) {
        Ok(json) => json,
        Err(_) => SettingsWrapper {
            Settings: Vec::new(),
        },
    };

    for setting in settings.Settings {
        if setting.name == needle.to_string() {
            return Ok(setting.value);
        }
    }

    println!("Err");
    Err(())
}

#[tauri::command]
pub fn get_setting(name: String, app: AppHandle) -> Result<Setting, ()> {
    let path = app
        .path_resolver()
        .resolve_resource("../public/settings/settings.json")
        .expect("Failed to resolve resource");

    let line = find_setting(&path, &name);

    match line {
        Ok(l) => Ok(Setting::new(name, l)),
        Err(_) => Err(()),
    }
}
