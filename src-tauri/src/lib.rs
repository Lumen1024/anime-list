mod commands;
mod db;
mod models;

use commands::AppState;
use db::AnimeDb;
use std::sync::Mutex;

#[tauri::command]
fn open_details_window(app: tauri::AppHandle, anime_id: Option<String>) -> Result<(), String> {
    use tauri::{Emitter, Manager};

    let window = app
        .get_webview_window("details")
        .ok_or("Details window not found")?;

    if let Some(id) = anime_id {
        window.emit("anime_id", id).map_err(|e| e.to_string())?;
    }

    window.show().map_err(|e| e.to_string())?;
    window.set_focus().map_err(|e| e.to_string())?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    println!("Starting Anime List application...");

    let db = AnimeDb::new().expect("Failed to initialize database");
    println!("Database initialized successfully");

    let app_state = AppState { db: Mutex::new(db) };

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![
            open_details_window,
            commands::create_anime,
            commands::get_anime,
            commands::update_anime,
            commands::delete_anime,
            commands::list_anime
        ])
        .on_window_event(|window, event| {
            use tauri::Manager;

            match event {
                tauri::WindowEvent::CloseRequested { api, .. } => {
                    if window.label() == "details" {
                        window.hide().unwrap();
                        api.prevent_close();
                    } else if window.label() == "main" {
                        let app_handle = window.app_handle();
                        app_handle.exit(0);
                    }
                }
                _ => {}
            }
        })
        .setup(|app| {
            println!("Tauri app setup complete");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
