use crate::models::Anime;
use sled::{Db, IVec};
use std::sync::Arc;

pub struct AnimeDb {
    db: Arc<Db>,
}

impl AnimeDb {
    pub fn new() -> Result<Self, String> {
        let db = sled::open("anime_db").map_err(|e| e.to_string())?;
        Ok(Self { db: Arc::new(db) })
    }

    pub fn create(&self, anime: Anime) -> Result<Anime, String> {
        let key = anime.id.as_bytes();
        let value = serde_json::to_vec(&anime).map_err(|e| e.to_string())?;

        self.db
            .insert(key, value)
            .map_err(|e| e.to_string())?;

        Ok(anime)
    }

    pub fn get(&self, id: &str) -> Result<Option<Anime>, String> {
        let key = id.as_bytes();

        match self.db.get(key).map_err(|e| e.to_string())? {
            Some(value) => {
                let anime: Anime = serde_json::from_slice(&value).map_err(|e| e.to_string())?;
                Ok(Some(anime))
            }
            None => Ok(None),
        }
    }

    pub fn update(&self, anime: Anime) -> Result<Anime, String> {
        let key = anime.id.as_bytes();

        if !self.db.contains_key(key).map_err(|e| e.to_string())? {
            return Err(format!("Anime with id {} not found", anime.id));
        }

        let value = serde_json::to_vec(&anime).map_err(|e| e.to_string())?;

        self.db
            .insert(key, value)
            .map_err(|e| e.to_string())?;

        Ok(anime)
    }

    pub fn delete(&self, id: &str) -> Result<bool, String> {
        let key = id.as_bytes();

        match self.db.remove(key).map_err(|e| e.to_string())? {
            Some(_) => Ok(true),
            None => Ok(false),
        }
    }

    pub fn list(&self) -> Result<Vec<Anime>, String> {
        let mut animes = Vec::new();

        for item in self.db.iter() {
            let (_key, value): (IVec, IVec) = item.map_err(|e| e.to_string())?;
            let anime: Anime = serde_json::from_slice(&value).map_err(|e| e.to_string())?;
            animes.push(anime);
        }

        Ok(animes)
    }
}
