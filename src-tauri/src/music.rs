use std::collections::HashMap;

use playerctl_wrapper::{
    metadata::Metadata,
    player::Player,
    playerctld::{DBusItem, Properties, Signals},
    properties,
};
use serde::Serialize;
use serde_json::json;
use tokio::sync::mpsc::Sender;

use crate::signal_handler::{emit_music_status_to_frontend, emit_to_frontend};

#[derive(Default, Clone, Debug, Serialize)]
pub struct MusicStatus {
    is_playing: Option<bool>,
    title: Option<String>,
    artist: Option<Vec<String>>,
    album: Option<String>,
    album_url: Option<String>,
    length: Option<i64>,
}

#[derive(Default, Debug, Serialize)]
pub struct MusicPosition {
    position: Option<f64>,
}

impl MusicStatus {
    pub fn new() -> Self {
        Self {
            is_playing: Some(false),
            title: Some(String::from("")),
            artist: Some(Vec::new()),
            album: Some(String::from("")),
            album_url: Some(String::from("")),
            length: Some(0),
        }
    }
}

impl MusicPosition {
    fn new() -> Self {
        Self {
            position: Some(0.0),
        }
    }
}

impl ToString for MusicStatus {
    fn to_string(&self) -> String {
        let is_playing = self.is_playing.unwrap_or(false).to_string();
        let title = self.title.clone().unwrap_or("".to_string());
        let artist = self.artist.clone().unwrap_or(Vec::new());
        let album = self.album.clone().unwrap_or("".to_string());
        let album_url = self.album_url.clone().unwrap_or("".to_string());
        let length = self.length.clone().unwrap_or(0);

        return json!({
            "is_playing": is_playing,
            "title": title,
            "artist": artist,
            "album": album,
            "album_url": album_url,
            "length": length,
        })
        .to_string();
    }
}

// TODO: change from using Command to using DBus, either querying playerctl or writing own

#[tauri::command]
pub fn prev_song() {
    if let Ok(player) = Player::new() {
        let _ = player.previous();
    }
}

#[tauri::command]
pub fn next_song() {
    if let Ok(player) = Player::new() {
        let _ = player.next();
    }
}

#[tauri::command]
pub fn play_pause() {
    if let Ok(player) = Player::new() {
        let _ = player.play_pause();
    }
}

#[tauri::command]
pub fn seek_song(position: i64) {
    if let Ok(player) = Player::new() {
        let _ = player.seek(position);
    }
}

#[tauri::command]
pub fn get_music_position() -> Result<MusicPosition, String> {
    let mut position = MusicPosition::new();
    if let Ok(player) = Player::new() {
        if let Ok(pos) = player.get_property("Position") {
            position.position = Some(pos);
        }
    }

    return Ok(position);
}

#[tauri::command]
pub fn get_music_status() -> Result<MusicStatus, String> {
    let mut status = MusicStatus::new();

    if let Ok(player) = Player::new() {
        let sts = player.get_property("Metadata").unwrap();
        let metadata = Metadata::from(&sts);

        status.title = metadata.title;
        status.album = metadata.album;
        status.artist = metadata.artist;
        status.length = metadata.length;
        status.is_playing = Some(true);
    }

    return Ok(status);
}

pub async fn send_music_status(sender: Sender<HashMap<String, String>>) {
    if let Ok(props) = properties::Properties::new() {
        let _ = props
            .properties_changed(sender.clone(), Some(props.get_interface()))
            .await;
    }
}

#[tauri::command]
pub async fn start_music_status_listener(app: tauri::AppHandle) {
    let (sender, mut receiver) = tokio::sync::mpsc::channel(100);
    let props = properties::Properties::new().unwrap();

    tokio::spawn(async move {
        let sender = sender.clone();
        let _ = props
            .properties_changed(sender, Some(props.get_interface()))
            .await;
    });
    while let Some(response) = receiver.recv().await {
        println!("Resp: {:?}", response);
        // emit_music_status_to_frontend("music-status-changed", response, app.clone());
    }
}
