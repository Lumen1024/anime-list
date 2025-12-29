mod commands;
mod db;
mod models;

use commands::AppState;
use db::AnimeDb;
use std::sync::Mutex;
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn open_details_window(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("details") {
        window.show().map_err(|e| e.to_string())?;
        window.set_focus().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let db = AnimeDb::new().expect("Failed to initialize database");
    let app_state = AppState {
        db: Mutex::new(db),
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![
            greet,
            open_details_window,
            commands::create_anime,
            commands::get_anime,
            commands::update_anime,
            commands::delete_anime,
            commands::list_anime
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
