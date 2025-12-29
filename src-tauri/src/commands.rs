use crate::db::AnimeDb;
use crate::models::{Anime, AnimeStatus};
use std::sync::Mutex;
use tauri::State;

pub struct AppState {
    pub db: Mutex<AnimeDb>,
}

#[tauri::command]
pub fn create_anime(
    state: State<AppState>,
    name: String,
    score: f64,
    review: String,
    link: String,
    status: AnimeStatus,
) -> Result<Anime, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let anime = Anime::new(name, score, review, link, status);
    db.create(anime)
}

#[tauri::command]
pub fn get_anime(state: State<AppState>, id: String) -> Result<Option<Anime>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.get(&id)
}

#[tauri::command]
pub fn update_anime(state: State<AppState>, anime: Anime) -> Result<Anime, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.update(anime)
}

#[tauri::command]
pub fn delete_anime(state: State<AppState>, id: String) -> Result<bool, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.delete(&id)
}

#[tauri::command]
pub fn list_anime(state: State<AppState>) -> Result<Vec<Anime>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.list()
}
