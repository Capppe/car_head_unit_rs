use playerctl_wrapper::{
    metadata::Metadata,
    player::Player,
    playerctld::{DBusItem, Properties},
    properties,
};
use serde::Serialize;
use serde_json::json;

use crate::signal_handler::emit_music_status_to_frontend;

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
pub fn toggle_shuffle() {
    if let Ok(player) = Player::new() {
        let shuffling = player.get_property::<bool>("Shuffle").unwrap_or(false);

        let _ = player.set_property("Shuffle", !shuffling);
    }
}

#[tauri::command]
pub fn seek_song(position: i64) {
    if let Ok(player) = Player::new() {
        let _ = player.seek(position);
    }
}

#[tauri::command]
pub fn get_music_position() -> Result<i64, String> {
    if let Ok(player) = Player::new() {
        if let Ok(pos) = player.get_property::<i64>("Position") {
            return Ok(pos);
        }
    }

    return Ok(0);
}

#[tauri::command]
pub fn get_music_status() -> Result<MusicStatus, String> {
    let mut status = MusicStatus::new();

    if let Ok(player) = Player::new() {
        if let Ok(sts) = player.get_property("Metadata") {
            let metadata = Metadata::from(&sts);

            let is_playing = player
                .get_property::<String>("PlaybackStatus")
                .map(|s| s.contains("Playing"))
                .unwrap_or(false);

            status.title = metadata.title;
            status.album = metadata.album;
            status.artist = metadata.artist;
            status.length = metadata.length;
            status.is_playing = Some(is_playing);
            status.album_url = metadata.art_url;
        }
    }

    return Ok(status);
}

#[tauri::command]
pub async fn start_music_status_listener(app: tauri::AppHandle) {
    let (sender, mut receiver) = tokio::sync::mpsc::channel(100);
    if let Ok(props) = properties::Properties::new() {
        tokio::spawn(async move {
            let sender = sender.clone();
            let _ = props
                .properties_changed(sender, Some(props.get_interface()))
                .await;
        });

        // TODO: improve...
        while let Some(response) = receiver.recv().await {
            if response.contains_key("PlaybackStatus") {
                if let Ok(metadata) = get_metadata() {
                    emit_music_status_to_frontend(
                        "music-status-changed",
                        MusicStatus {
                            is_playing: Some(
                                response
                                    .get("PlaybackStatus")
                                    .map(|s| s.contains("Playing"))
                                    .unwrap_or(false),
                            ),
                            title: metadata.title,
                            artist: metadata.artist,
                            album: metadata.album,
                            length: metadata.length,
                            album_url: metadata.art_url,
                        },
                        app.clone(),
                    );
                }
            } else if response.contains_key("Metadata") {
                if let Ok(metadata) = get_metadata() {
                    emit_music_status_to_frontend(
                        "music-status-changed",
                        MusicStatus {
                            is_playing: Some(true),
                            album: metadata.album,
                            album_url: metadata.art_url,
                            artist: metadata.artist,
                            length: metadata.length,
                            title: metadata.title,
                        },
                        app.clone(),
                    )
                }
            }
        }
    }
}

fn get_metadata() -> Result<Metadata, String> {
    if let Ok(player) = Player::new() {
        let metadata_prop = player
            .get_property("Metadata")
            .map_err(|e| format!("Failed to get metadata: {}", e))?;

        Ok(Metadata::from(&metadata_prop))
    } else {
        Err(format!("Failed to create a player"))
    }
}
