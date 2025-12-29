import { invoke } from "@tauri-apps/api/core"
import type { Anime } from "@/model/Anime"
import type { AnimeStatus } from "@/model/AnimeStatus"

export interface AnimeWithId extends Anime {
    id: string
}

export const animeApi = {
    async create(
        name: string,
        score: number,
        review: string,
        link: string,
        status: AnimeStatus
    ): Promise<AnimeWithId> {
        return await invoke<AnimeWithId>("create_anime", {
            name,
            score,
            review,
            link,
            status,
        })
    },

    async get(id: string): Promise<AnimeWithId | null> {
        return await invoke<AnimeWithId | null>("get_anime", { id })
    },

    async update(anime: AnimeWithId): Promise<AnimeWithId> {
        return await invoke<AnimeWithId>("update_anime", { anime })
    },

    async delete(id: string): Promise<boolean> {
        return await invoke<boolean>("delete_anime", { id })
    },

    async list(): Promise<AnimeWithId[]> {
        return await invoke<AnimeWithId[]>("list_anime")
    },
}
