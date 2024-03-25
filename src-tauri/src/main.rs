// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod error;
mod storage;

fn main() {
    tauri::Builder::default()
        .plugin(storage::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
