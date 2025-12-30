use crate::models::AnimeImage;
use scraper::{Html, Selector};

pub async fn fetch_anime_image(link: &str) -> Result<AnimeImage, String> {
    if !link.starts_with("https://shikimori.one/animes/") {
        return Err("Неподдерживаемая ссылка. Обрабатываются только ссылки с https://shikimori.one/animes/".to_string());
    }

    let html = reqwest::get(link)
        .await
        .map_err(|e| format!("Ошибка при запросе страницы: {}", e))?
        .text()
        .await
        .map_err(|e| format!("Ошибка при чтении HTML: {}", e))?;

    let img_url = {
        let document = Html::parse_document(&html);

        let selector = Selector::parse("#animes_show > section > div > div.menu-slide-outer.x199 > div > div > div:nth-child(1) > div.b-db_entry > div.c-image > div.cc.block > div.c-poster > div > picture > source")
            .map_err(|e| format!("Ошибка парсинга селектора: {:?}", e))?;

        let source_element = document
            .select(&selector)
            .next()
            .ok_or_else(|| "Элемент source не найден на странице".to_string())?;

        let srcset = source_element
            .value()
            .attr("srcset")
            .ok_or_else(|| "Атрибут srcset не найден".to_string())?;

        // Извлекаем URL с 2x (высокое разрешение) или первый доступный
        let img_src = srcset
            .split(',')
            .map(|s| s.trim())
            .find(|s| s.contains("2x"))
            .and_then(|s| s.split_whitespace().next())
            .unwrap_or_else(|| {
                srcset
                    .split(',')
                    .next()
                    .and_then(|s| s.trim().split_whitespace().next())
                    .unwrap_or(srcset)
            });

        if img_src.starts_with("//") {
            format!("https:{}", img_src)
        } else if img_src.starts_with("/") {
            format!("https://shikimori.one{}", img_src)
        } else {
            img_src.to_string()
        }
    };

    let image_response = reqwest::get(&img_url)
        .await
        .map_err(|e| format!("Ошибка при загрузке изображения: {}", e))?;

    let content_type = image_response
        .headers()
        .get("content-type")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("image/jpeg")
        .to_string();

    let image_data = image_response
        .bytes()
        .await
        .map_err(|e| format!("Ошибка при чтении данных изображения: {}", e))?
        .to_vec();

    Ok(AnimeImage {
        link: link.to_string(),
        image_data,
        content_type,
    })
}
