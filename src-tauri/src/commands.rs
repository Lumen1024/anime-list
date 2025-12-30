use crate::db::AnimeDb;
use crate::models::{Anime, AnimeStatus, AnimeImage};
use crate::scraper;
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
    println!("Creating anime: {}, score: {}", name, score);

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

#[tauri::command]
pub async fn get_anime_image(state: State<'_, AppState>, id: String) -> Result<AnimeImage, String> {
    let link = {
        let db = state.db.lock().map_err(|e| e.to_string())?;
        let anime = db.get(&id)?.ok_or_else(|| format!("Anime with id {} not found", id))?;

        if let Some(cached_image) = db.get_image(&anime.link)? {
            println!("Returning cached image for link: {}", anime.link);
            return Ok(cached_image);
        }

        anime.link.clone()
    };

    println!("Fetching new image for link: {}", link);

    let image = scraper::fetch_anime_image(&link).await?;

    {
        let db = state.db.lock().map_err(|e| e.to_string())?;
        db.save_image(image.clone())?;
    }

    Ok(image)
}

#[tauri::command]
pub async fn get_image_by_link(state: State<'_, AppState>, link: String) -> Result<AnimeImage, String> {
    if let Some(cached_image) = {
        let db = state.db.lock().map_err(|e| e.to_string())?;
        db.get_image(&link)?
    } {
        println!("Returning cached image for link: {}", link);
        return Ok(cached_image);
    }

    println!("Fetching new image for link: {}", link);

    let image = scraper::fetch_anime_image(&link).await?;

    {
        let db = state.db.lock().map_err(|e| e.to_string())?;
        db.save_image(image.clone())?;
    }

    Ok(image)
}
