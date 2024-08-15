use std::{
    io::{BufRead, BufReader},
    process::{Command, Stdio},
};

use async_channel::Sender;
use serde::Serialize;
use serde_json::json;

use crate::signal_handler::emit_to_frontend;

#[derive(Default, Debug, Serialize)]
pub struct MusicStatus {
    is_playing: Option<bool>,
    title: Option<String>,
    artist: Option<String>,
    album: Option<String>,
    album_url: Option<String>,
    length: Option<f64>,
}

#[derive(Default, Debug, Serialize)]
pub struct MusicPosition {
    position: Option<f64>,
}

impl MusicStatus {
    fn new() -> Self {
        Self {
            is_playing: Some(false),
            title: Some(String::from("")),
            artist: Some(String::from("")),
            album: Some(String::from("")),
            album_url: Some(String::from("")),
            length: Some(0.0),
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
        let artist = self.artist.clone().unwrap_or("".to_string());
        let album = self.album.clone().unwrap_or("".to_string());
        let album_url = self.album_url.clone().unwrap_or("".to_string());
        let length = self.length.clone().unwrap_or(0.0);

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
    let _pctl_output = Command::new("playerctl")
        .arg("previous")
        .output()
        .expect("Failed to call playerctl");
}

#[tauri::command]
pub fn next_song() {
    let _pctl_output = Command::new("playerctl")
        .arg("next")
        .output()
        .expect("Failed to call playerctl");
}

#[tauri::command]
pub fn play_pause() {
    let _pctl_output = Command::new("playerctl")
        .arg("play-pause")
        .output()
        .expect("Failed to call playerctl");
}

#[tauri::command]
pub fn seek_song(position: String) {
    let _pctl_output = Command::new("playerctl")
        .arg("position")
        .arg(position)
        .output()
        .expect("Failed to call playerctl");
}

#[tauri::command]
pub fn get_music_position() -> Result<MusicPosition, String> {
    let mut position = MusicPosition::new();
    let pctl_output = Command::new("playerctl")
        .arg("position")
        .output()
        .expect("Failed to call playerctl");

    if pctl_output.status.success() {
        let output = String::from_utf8_lossy(&pctl_output.stdout);
        let s = output.trim();

        position.position = Some(s.parse::<f64>().unwrap_or(0.0));

        return Ok(position);
    }

    return Ok(position);
}

#[tauri::command]
pub fn get_music_status() -> Result<MusicStatus, String> {
    let mut status = MusicStatus::new();
    let pctl_output = Command::new("playerctl")
        .arg("metadata")
        .arg("--format")
        .arg("{{status}}&&{{title}}&&{{artist}}&&{{album}}&&{{mpris:artUrl}}&&{{mpris:length}}")
        .output()
        .expect("Failed to get music status");

    if pctl_output.status.success() {
        let output = String::from_utf8_lossy(&pctl_output.stdout);
        let s = output.trim().split("&&").collect::<Vec<&str>>();

        status.is_playing = Some(s[0].trim() == "Playing");
        status.title = Some(s[1].to_string());
        status.artist = Some(s[2].to_string());
        status.album = Some(s[3].to_string());
        status.album_url = Some(s[4].to_string());
        status.length = Some(s[5].parse::<f64>().unwrap_or(0.0) / 1000000.0);

        return Ok(status);
    }
    return Ok(status);
}

pub async fn send_music_status(sender: Sender<String>) {
    let mut status = MusicStatus::new();

    tokio::spawn(async move {
        let mut pctl_track_info = Command::new("playerctl")
            .arg("metadata")
            .arg("--format")
            .arg("{{status}}&&{{title}}&&{{artist}}&&{{album}}&&{{mpris:artUrl}}&&{{mpris:length}}")
            .arg("--follow")
            .stdout(Stdio::piped())
            .spawn()
            .expect("Failed to execute playerctl");

        let stdout = pctl_track_info
            .stdout
            .take()
            .expect("Failed to open stdout");

        let reader = BufReader::new(stdout);
        let mut lines = reader.lines();

        while let Some(Ok(line)) = lines.next() {
            let info = line.split("&&").collect::<Vec<&str>>();

            status.is_playing = Some(info[0].trim() == "Playing");
            status.title = Some(info[1].to_string());
            status.artist = Some(info[2].to_string());
            status.album = Some(info[3].to_string());
            status.album_url = Some(info[4].to_string());
            status.length = Some(info[5].parse::<f64>().unwrap_or(0.0) / 1000000.0);

            sender
                .send(status.to_string())
                .await
                .expect("Channel is closed");
        }
    });
}

#[tauri::command]
pub async fn start_music_status_listener(app: tauri::AppHandle) {
    let (sender, receiver) = async_channel::bounded(1);

    tokio::spawn(async move {
        let _ = send_music_status(sender).await;
    });

    while let Ok(response) = receiver.recv().await {
        emit_to_frontend("music-status-changed", response, app.clone());
    }
}
