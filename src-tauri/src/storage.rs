use crate::error::Error;
use std::io::prelude::*;
use std::{fs, io, path};
use tauri::{
    plugin::{Builder, TauriPlugin},
    AppHandle, Runtime,
};

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

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn read<R: Runtime>(app_handle: AppHandle<R>) -> Result<String, Error> {
    let data_file = resolve_data_file(app_handle)?;

    if !data_file.exists() {
        let mut file = fs::File::create(&data_file)?;
        file.write_all(b"{\"name\": \"Root\", \"progressPercent\": 0}")?;
    }

    let mut contents = String::new();
    let mut file = fs::File::open(&data_file)?;
    file.read_to_string(&mut contents)?;

    Ok(contents)
}

#[tauri::command]
fn write<R: Runtime>(app_handle: AppHandle<R>, content: String) -> Result<(), Error> {
    let data_file = resolve_data_file(app_handle)?;
    let mut file = fs::File::create(&data_file)?;
    file.write_all(content.as_bytes())?;
    Ok(())
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("storage")
        .invoke_handler(tauri::generate_handler![read, write])
        .build()
}
