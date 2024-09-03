use reqwest::get;
use serde::Deserialize;
use std::{env, fmt::format};

#[derive(Deserialize)]
struct Release {
    tag_name: String,
    assets: Vec<Asset>,
}

#[derive(Deserialize)]
struct Asset {
    download_url: String,
    name: String,
}

#[tauri::command]
pub async fn check_for_update(curr_version: String) -> Result<Option<String>, String> {
    let repo_owner = "capppe";
    let repo_name = "car_head_unit_rs";
    let url = format!(
        "https://api.github.com/repos/{}/{}/releases/latest",
        repo_owner, repo_name
    );

    let response = get(&url)
        .await
        .map_err(|e| format!("Failed to get update info from url: {}, cause: {}", &url, e))?;

    println!("Response: {:?}", response);

    let release: Release = match response.json().await {
        Ok(r) => r,
        Err(e) => {
            if e.is_decode() {
                return Ok(None);
            } else {
                return Err(e.to_string());
            }
        }
    };

    if release.tag_name > curr_version {
        let platform = "linux";

        for asset in release.assets {
            if asset.name.contains(platform) {
                return Ok(Some(asset.download_url));
            }
        }
    }

    Ok(None)
}
