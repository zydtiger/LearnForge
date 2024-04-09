use crate::error::Error;
use chrono::Local;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::io::prelude::*;
use std::{fs, io, path};
use tauri::{
    plugin::{Builder, TauriPlugin},
    AppHandle, Runtime,
};

#[derive(Debug, Serialize, Deserialize)]
struct RawNodeDatum {
    name: String,
    #[serde(rename = "progressPercent")]
    progress_percent: f64,
    attributes: Option<HashMap<String, serde_json::Value>>,
    children: Option<Vec<RawNodeDatum>>,
}

impl Default for RawNodeDatum {
    fn default() -> Self {
        RawNodeDatum {
            name: "Root".into(),
            progress_percent: 0.0,
            attributes: None,
            children: None,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
struct SkillsetState {
    data: RawNodeDatum,
    #[serde(rename = "isInitialBoot")]
    is_initial_boot: bool,
    #[serde(rename = "lastSaveTime")]
    last_save_time: String,
}

impl Default for SkillsetState {
    fn default() -> Self {
        SkillsetState {
            data: RawNodeDatum::default(),
            is_initial_boot: true,
            last_save_time: Local::now().to_rfc3339(), // ISO 8601 format
        }
    }
}

/// Resolves the path of the data file for storage.
///
/// # Errors
///
/// 1. App data directory not found
/// 2. `create_dir_all` failed
///
/// # Notes
///
/// Maybe could be a database here?
///
fn resolve_data_file<R: Runtime>(app_handle: AppHandle<R>) -> Result<path::PathBuf, io::Error> {
    let app_data_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .ok_or(io::Error::new(
            io::ErrorKind::NotFound,
            "App data directory not found",
        ))?;

    if !app_data_dir.exists() {
        fs::create_dir_all(&app_data_dir)?;
    }

    Ok(app_data_dir.join("skillset.json"))
}

/// Handles reading data file and filling data file with default value if not exists.
///
/// # Errors
///
/// 1. Resolve data file path failed
/// 2. `File::create` failed when data file does not exist
/// 3. `write_all` failed when filling new data file with default
/// 4. `File::open` failed when opening data file for read
/// 5. `read_to_string` failed when reading
///
/// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
///
#[tauri::command]
fn read<R: Runtime>(app_handle: AppHandle<R>) -> Result<SkillsetState, Error> {
    let data_file = resolve_data_file(app_handle)?;

    if !data_file.exists() {
        let mut file = fs::File::create(&data_file)?;
        let default = serde_json::to_string(&SkillsetState::default())?;
        file.write_all(default.as_bytes())?;
    }

    let mut contents = String::new();
    let mut file = fs::File::open(&data_file)?;
    file.read_to_string(&mut contents)?;

    Ok(serde_json::from_str(&contents)?)
}

/// Handles writing to data file with frontend data.
///
/// # Errors
///
/// 1. Resolve data file path failed
/// 2. `File::create` failed when opening data file for write
/// 3. `write_all` failed when filling data file with `content`
///
#[tauri::command]
fn write<R: Runtime>(app_handle: AppHandle<R>, state: SkillsetState) -> Result<(), Error> {
    let data_file = resolve_data_file(app_handle)?;
    let mut file = fs::File::create(&data_file)?;
    let content = serde_json::to_string(&state)?;
    file.write_all(content.as_bytes())?;
    Ok(())
}

/// Handles exporting to chosen path.
///
/// # Errors
///
/// 1. Resolve data file path failed
/// 2. `copy` failed when copying data file to path
///
#[tauri::command]
fn export<R: Runtime>(app_handle: AppHandle<R>, file_path: String) -> Result<(), Error> {
    let data_file = resolve_data_file(app_handle)?;
    fs::copy(data_file, file_path)?;
    Ok(())
}

/// Initializes the storage plugin with read, write handlers.
///
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("storage")
        .invoke_handler(tauri::generate_handler![read, write, export])
        .build()
}
