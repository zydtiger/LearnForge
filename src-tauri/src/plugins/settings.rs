use crate::defs::Error;
use crate::defs::SettingsState;
use std::{fs, io, path};
use tauri::{
    plugin::{Builder, TauriPlugin},
    AppHandle, Runtime,
};

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

/// Handles reading settings file and filling settings file with default value if not exists.
///
/// # Errors
///
/// 1. Resolve settings file path failed
/// 2. `write` failed when filling new settings file with default
/// 3. `read_to_string` failed when reading settings file
///
#[tauri::command]
fn read<R: Runtime>(app_handle: AppHandle<R>) -> Result<SettingsState, Error> {
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
fn write<R: Runtime>(app_handle: AppHandle<R>, state: SettingsState) -> Result<(), Error> {
    let settings_file = resolve_settings_file(app_handle)?;
    let content = serde_json::to_string(&state)?;
    fs::write(&settings_file, content)?;
    Ok(())
}

/// Initializes the settings plugin with read, write handlers.
///
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("settings")
        .invoke_handler(tauri::generate_handler![read, write])
        .build()
}
