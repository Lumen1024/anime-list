import { AnimeStatus } from "./AnimeStatus"

export type Anime = {
    name: string
    score: number
    review: string
    link: string
    status: AnimeStatus
}