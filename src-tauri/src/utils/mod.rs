use std::{fs, io, path};
use tauri::{AppHandle, Runtime};

/// Resolves the path of the app data directory.
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
pub fn resolve_app_data_dire<R: Runtime>(
    app_handle: AppHandle<R>,
) -> Result<path::PathBuf, io::Error> {
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

    Ok(app_data_dir)
}
