import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { animeApi, type AnimeWithId } from "@/api/anime"
import { AnimeStatus } from "@/model/AnimeStatus"
import { getCurrentWindow } from "@tauri-apps/api/window"

interface DetailsWindowProps extends ComponentProps<"div"> {
    animeId?: string
}

export const DetailsWindow = ({ className, animeId, ...props }: DetailsWindowProps) => {
    const [name, setName] = useState("")
    const [score, setScore] = useState("0")
    const [review, setReview] = useState("")
    const [link, setLink] = useState("")
    const [status, setStatus] = useState<AnimeStatus>(AnimeStatus.None)
    const [isLoading, setIsLoading] = useState(false)
    const [editingAnime, setEditingAnime] = useState<AnimeWithId | null>(null)

    const isEditMode = !!animeId || !!editingAnime

    useEffect(() => {
        const loadAnime = async () => {
            if (animeId) {
                try {
                    const anime = await animeApi.get(animeId)
                    if (anime) {
                        setEditingAnime(anime)
                        setName(anime.name)
                        setScore(anime.score.toString())
                        setReview(anime.review)
                        setLink(anime.link)
                        setStatus(anime.status)
                    }
                } catch (error) {
                    console.error("Ошибка загрузки аниме:", error)
                }
            }
        }

        loadAnime()
    }, [animeId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const scoreValue = parseFloat(score)

            if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 10) {
                alert("Оценка должна быть числом от 0 до 10")
                return
            }

            if (isEditMode && editingAnime) {
                await animeApi.update({
                    ...editingAnime,
                    name,
                    score: scoreValue,
                    review,
                    link,
                    status,
                })
            } else {
                await animeApi.create(name, scoreValue, review, link, status)
            }

            const currentWindow = getCurrentWindow()
            await currentWindow.close()
        } catch (error) {
            console.error("Ошибка сохранения:", error)
            alert("Ошибка при сохранении аниме")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = async () => {
        const currentWindow = getCurrentWindow()
        await currentWindow.close()
    }

    return (
        <div
            className={cn("flex flex-col w-screen h-screen p-6 gap-4", className)}
            {...props}
        >
            <h1 className="text-2xl font-bold">
                {isEditMode ? "Редактировать аниме" : "Добавить аниме"}
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Название</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Введите название аниме"
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="score">Оценка (0-10)</Label>
                    <Input
                        id="score"
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        placeholder="0.0"
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="link">Ссылка</Label>
                    <Input
                        id="link"
                        type="url"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="https://..."
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="status">Статус</Label>
                    <Select
                        value={status.toString()}
                        onValueChange={(value) => setStatus(parseInt(value) as AnimeStatus)}
                    >
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Выберите статус" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={AnimeStatus.None.toString()}>
                                Нет статуса
                            </SelectItem>
                            <SelectItem value={AnimeStatus.Completed.toString()}>
                                Завершено
                            </SelectItem>
                            <SelectItem value={AnimeStatus.Waiting.toString()}>
                                В ожидании
                            </SelectItem>
                            <SelectItem value={AnimeStatus.Dropped.toString()}>
                                Брошено
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-2 flex-1">
                    <Label htmlFor="review">Отзыв</Label>
                    <Textarea
                        id="review"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Ваш отзыв об аниме..."
                        className="flex-1 min-h-[120px]"
                    />
                </div>

                <div className="flex gap-3 mt-auto">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1"
                    >
                        {isLoading ? "Сохранение..." : isEditMode ? "Сохранить" : "Добавить"}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        Отмена
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default DetailsWindow
