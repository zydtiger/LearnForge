// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod defs;
mod plugins;

fn main() {
    tauri::Builder::default()
        .plugin(plugins::skillset::init())
        .plugin(plugins::settings::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
