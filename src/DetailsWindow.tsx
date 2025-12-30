import "@/App.css"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import type { ComponentProps } from "react"
import { useEffect } from "react"
import {animeApi, type AnimeWithId} from "@/api/anime"
import type { Anime } from "@/model/Anime"
import { AnimeStatus } from "@/model/AnimeStatus"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { ScoreSelect } from "@/components/ScoreSelect"
import { AnimeStatusSelect } from "@/components/AnimeStatusSelect"

interface DetailsWindowProps extends ComponentProps<"div"> {
    animeId?: string
}

export const DetailsWindow = ({ className, animeId,  ...props }: DetailsWindowProps) => {
    const form = useForm<Anime>({
        defaultValues: {
            name: "",
            score: 0,
            review: "",
            link: "",
            status: AnimeStatus.None,
        },
    })

    useEffect(() => {
        const loadAnimeData = async () => {
            if (animeId) {
                try {
                    const animeData = await animeApi.get(animeId)
                    if (animeData) {
                        // Преобразуем AnimeWithId в Anime для формы
                        const { id, ...animeWithoutId } = animeData
                        form.reset(animeWithoutId)
                    }
                } catch (error) {
                    console.error("Ошибка при загрузке аниме:", error)
                    // Можно показать ошибку пользователю
                    alert("Не удалось загрузить данные аниме")
                }
            }
        }

        loadAnimeData()
    }, [animeId, form])

   const onSubmit = async (data: Anime) => {
    try {
        console.log("Submitting anime data:", data);
        
        if (animeId) {
            // Режим редактирования
            const animeWithId: AnimeWithId = {
                id: animeId,
                ...data
            }
            console.log("Updating anime:", animeWithId);
            
            const updated = await animeApi.update(animeWithId)
            console.log("Update successful:", updated);
            
            alert("Аниме успешно обновлено!")
        } else {
            // Режим создания
            console.log("Creating new anime with data:", data);
            
            const newAnime = await animeApi.create(
                data.name,
                data.score,
                data.review,
                data.link,
                data.status
            )
            
            console.log("Create successful, new ID:", newAnime.id);
            
            alert("Аниме успешно добавлено!")
            
            // Очистить форму после успешного создания
            form.reset({
                name: "",
                score: 0,
                review: "",
                link: "",
                status: AnimeStatus.None,
            })
        }
        
    } catch (error) {
        console.error("Ошибка при сохранении аниме:", error);
        console.error("Тип ошибки:", typeof error);
        console.error("Полный объект ошибки:", error);
        
        // Попробуем получить больше информации об ошибке
        let errorMessage = "Не удалось сохранить аниме.";
        
        if (error instanceof Error) {
            errorMessage += ` Ошибка: ${error.message}`;
        } else if (typeof error === 'string') {
            errorMessage += ` Ошибка: ${error}`;
        } else if (error && typeof error === 'object') {
            try {
                errorMessage += ` Ошибка: ${JSON.stringify(error)}`;
            } catch {
                errorMessage += ` Неизвестная ошибка: ${String(error)}`;
            }
        }
        
        alert(errorMessage);
    }
}

    return (
        <div
            className={cn("flex w-screen h-screen p-4 gap-4", className)}
            {...props}
        >
            <div className="flex-1">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Название</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Введите название аниме" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="score"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Оценка</FormLabel>
                                    <FormControl>
                                        <ScoreSelect
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Статус</FormLabel>
                                    <FormControl>
                                        <AnimeStatusSelect
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="link"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ссылка</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="review"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Отзыв</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Напишите свой отзыв..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit">
                            {animeId ? "Сохранить" : "Создать"}
                        </Button>
                    </form>
                </Form>
            </div>

            <div className="flex-1 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                Изображение (в разработке)
            </div>
        </div>
    )
}

export default DetailsWindow
