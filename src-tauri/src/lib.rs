mod commands;
mod db;
mod models;

use commands::AppState;
use db::AnimeDb;
use std::sync::Mutex;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn open_details_window(app: tauri::AppHandle, anime_id: Option<String>) -> Result<(), String> {
    use tauri::{WebviewUrl, WebviewWindowBuilder};

    // Генерируем уникальный label для окна
    let window_label = format!("details-{}", uuid::Uuid::new_v4());

    // Создаём новое окно
    let window = WebviewWindowBuilder::new(&app, &window_label, WebviewUrl::App("index.html".into()))
        .title(if anime_id.is_some() { "Редактировать аниме" } else { "Добавить аниме" })
        .inner_size(600.0, 700.0)
        .resizable(true)
        .build()
        .map_err(|e| e.to_string())?;

    // Если передан anime_id, можно передать его в окно через localStorage или другой механизм
    if let Some(id) = anime_id {
        // Передаём ID через eval в новое окно
        let script = format!(r#"window.localStorage.setItem('editAnimeId', '{}');"#, id);
        window.eval(&script).map_err(|e| e.to_string())?;
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
