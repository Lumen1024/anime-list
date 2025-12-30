import { invoke } from "@tauri-apps/api/core"
import type { Anime } from "@/model/Anime"
import { AnimeStatus } from "@/model/AnimeStatus"

export interface AnimeWithId extends Anime {
    id: string
}

export const mockAnimeList: AnimeWithId[] = [
    {
        id: "1",
        name: "Cowboy Bebop",
        score: 5,
        review: "Отличное аниме с потрясающим саундтреком и глубокими персонажами",
        link: "https://myanimelist.net/anime/1/Cowboy_Bebop",
        status: AnimeStatus.Completed,
    },
    {
        id: "2",
        name: "Steins;Gate",
        score: 5,
        review: "Захватывающий научно-фантастический триллер о путешествиях во времени",
        link: "https://myanimelist.net/anime/9253/Steins_Gate",
        status: AnimeStatus.Completed,
    },
    {
        id: "3",
        name: "One Piece",
        score: 4,
        review: "Долгое, но увлекательное приключение",
        link: "https://myanimelist.net/anime/21/One_Piece",
        status: AnimeStatus.Waiting,
    },
    {
        id: "4",
        name: "Attack on Titan",
        score: 3,
        review: "",
        link: "https://myanimelist.net/anime/16498/Shingeki_no_Kyojin",
        status: AnimeStatus.Dropped,
    },
    {
        id: "5",
        name: "Demon Slayer",
        score: 0,
        review: "",
        link: "https://myanimelist.net/anime/38000/Kimetsu_no_Yaiba",
        status: AnimeStatus.None,
    },
]

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
