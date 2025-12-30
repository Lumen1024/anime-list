use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum AnimeStatus {
    Completed,
    Dropped,
    Waiting,
    None,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Anime {
    pub id: String,
    pub name: String,
    pub score: f64,
    pub review: String,
    pub link: String,
    pub status: AnimeStatus,
}

impl Anime {
    pub fn new(name: String, score: f64, review: String, link: String, status: AnimeStatus) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            name,
            score,
            review,
            link,
            status,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AnimeImage {
    pub link: String,
    pub image_data: Vec<u8>,
    pub content_type: String,
}
