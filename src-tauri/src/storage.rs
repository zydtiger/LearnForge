use crate::error::Error;
use chrono::Local;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::{fs, io, path};
use tauri::{
    plugin::{Builder, TauriPlugin},
    AppHandle, Runtime,
};

#[derive(Debug, Serialize, Deserialize)]
struct SkillsetRawNode {
    id: Option<String>, // uses Option so None is default value
    name: String,
    #[serde(rename = "progressPercent")]
    progress_percent: f64,
    #[serde(rename = "mdNote")]
    md_note: Option<String>,
    attributes: Option<HashMap<String, serde_json::Value>>,
    children: Option<Vec<SkillsetRawNode>>,
}

impl Default for SkillsetRawNode {
    fn default() -> Self {
        SkillsetRawNode {
            id: None,
            name: "Root".into(),
            progress_percent: 0.0,
            md_note: None,
            attributes: None,
            children: None,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
struct SkillsetState {
    data: SkillsetRawNode,
    #[serde(rename = "isInitialBoot")]
    is_initial_boot: bool,
    #[serde(rename = "lastSaveTime")]
    last_save_time: String,
}

impl Default for SkillsetState {
    fn default() -> Self {
        SkillsetState {
            data: SkillsetRawNode::default(),
            is_initial_boot: true,
            last_save_time: Local::now().to_rfc3339(), // ISO 8601 format
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
enum GlobalTheme {
    #[serde(rename = "light")]
    Light,
    #[serde(rename = "dark")]
    Dark,
    #[serde(rename = "system")]
    System,
}

#[derive(Debug, Serialize, Deserialize)]
enum PreviewTheme {
    #[serde(rename = "default")]
    Default,
    #[serde(rename = "github")]
    Github,
    #[serde(rename = "vuepress")]
    Vuepress,
    #[serde(rename = "mk-cute")]
    MkCute,
    #[serde(rename = "smart-blue")]
    SmartBlue,
    #[serde(rename = "cyanosis")]
    Cyanosis,
}

#[derive(Debug, Serialize, Deserialize)]
struct SettingsState {
    #[serde(rename = "globalTheme")]
    global_theme: GlobalTheme,
    #[serde(rename = "mdPreviewTheme")]
    md_preview_theme: PreviewTheme,
}

impl Default for SettingsState {
    fn default() -> Self {
        Self {
            global_theme: GlobalTheme::System,
            md_preview_theme: PreviewTheme::Default,
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

/// Resolves the path of the settings file.
///
/// # Errors
///
/// 1. App data directory not found
/// 2. `create_dir_all` failed
///
fn resolve_settings_file<R: Runtime>(app_handle: AppHandle<R>) -> Result<path::PathBuf, io::Error> {
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

    Ok(app_data_dir.join("settings.json"))
}

/// Handles reading data file and filling data file with default value if not exists.
///
/// # Errors
///
/// 1. Resolve data file path failed
/// 2. `write` failed when filling new data file with default
/// 3. `read_to_string` failed when reading data file
///
/// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
///
#[tauri::command]
fn read<R: Runtime>(app_handle: AppHandle<R>) -> Result<SkillsetState, Error> {
    let data_file = resolve_data_file(app_handle)?;

    if !data_file.exists() {
        let default = serde_json::to_string(&SkillsetState::default())?;
        fs::write(&data_file, default)?;
    }

    let content = fs::read_to_string(&data_file)?;
    Ok(serde_json::from_str(&content)?)
}

/// Handles writing to data file with frontend data.
///
/// # Errors
///
/// 1. Resolve data file path failed
/// 2. `write` failed when filling data file with `content`
///
#[tauri::command]
fn write<R: Runtime>(app_handle: AppHandle<R>, state: SkillsetState) -> Result<(), Error> {
    let data_file = resolve_data_file(app_handle)?;
    let content = serde_json::to_string(&state)?;
    fs::write(&data_file, content)?;
    Ok(())
}

/// Handles exporting to chosen path.
///
/// # Errors
///
/// 1. Resolve data file path failed
/// 2. `copy` failed when copying data file to path
/// 3. `write` failed when filling target file with payload
///
#[tauri::command]
fn export<R: Runtime>(
    app_handle: AppHandle<R>,
    file_path: String,
    payload: Option<Vec<u8>>,
) -> Result<(), Error> {
    let parts: Vec<&str> = file_path.split('.').collect();
    let extension = parts[parts.len() - 1];
    if extension == "lf" {
        let data_file = resolve_data_file(app_handle)?;
        fs::copy(&data_file, &file_path)?;
    } else {
        fs::write(&file_path, payload.unwrap_or(b"".into()))?;
    }
    Ok(())
}

/// Handles importing from chosen path.
///
/// # Errors
///
/// 1. Resolve data file path failed
/// 2. `copy` failed when copying selected path to data file
///
#[tauri::command]
fn import<R: Runtime>(app_handle: AppHandle<R>, file_path: String) -> Result<(), Error> {
    let data_file = resolve_data_file(app_handle)?;
    fs::copy(file_path, data_file)?;
    Ok(())
}

/// Handles reading settings file and filling settings file with default value if not exists.
///
/// # Errors
///
/// 1. Resolve settings file path failed
/// 2. `write` failed when filling new settings file with default
/// 3. `read_to_string` failed when reading settings file
///
#[tauri::command]
fn read_settings<R: Runtime>(app_handle: AppHandle<R>) -> Result<SettingsState, Error> {
    let settings_file = resolve_settings_file(app_handle)?;
    if !settings_file.exists() {
        let default = serde_json::to_string(&SettingsState::default())?;
        fs::write(&settings_file, default)?;
    }

    let content = fs::read_to_string(&settings_file)?;
    Ok(serde_json::from_str(&content)?)
}

/// Handles writing to settings file with frontend data.
///
/// # Errors
///
/// 1. Resolve settings file path failed
/// 2. `write` failed when filling settings file with `content`
///
#[tauri::command]
fn write_settings<R: Runtime>(app_handle: AppHandle<R>, state: SettingsState) -> Result<(), Error> {
    let settings_file = resolve_settings_file(app_handle)?;
    let content = serde_json::to_string(&state)?;
    fs::write(&settings_file, content)?;
    Ok(())
}

/// Initializes the storage plugin with read, write handlers.
///
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("storage")
        .invoke_handler(tauri::generate_handler![
            read,
            write,
            export,
            import,
            read_settings,
            write_settings
        ])
        .build()
}
