import "@/App.css";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import { animeApi, type AnimeWithId } from "@/api/anime";
import type { Anime } from "@/model/Anime";
import { AnimeStatus } from "@/model/AnimeStatus";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { emit, listen } from "@tauri-apps/api/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { ScoreSelect } from "@/components/ScoreSelect";
import { AnimeStatusSelect } from "@/components/AnimeStatusSelect";
import { AnimeImage } from "@/components/AnimeImage";

interface DetailsWindowProps extends ComponentProps<"div"> {
    animeId?: string;
}

export const DetailsWindow = ({
    className,
    animeId: initialAnimeId,
    ...props
}: DetailsWindowProps) => {
    const [animeId, setAnimeId] = useState<string | undefined>(initialAnimeId);

    const form = useForm<Anime>({
        defaultValues: {
            name: "",
            score: 0,
            review: "",
            link: "",
            status: AnimeStatus.None,
        },
    });

    useEffect(() => {
        console.log("Setting up anime_id listener in DetailsWindow");
        const setupListener = async () => {
            const unlisten = await listen<string>("anime_id", async (event) => {
                console.log("Received anime_id event:", event);
                console.log("Event payload:", event.payload);
                console.log("Event payload type:", typeof event.payload);
                const id = event.payload?.trim();
                console.log("Trimmed id:", id);

                if (id && id.length > 0) {
                    console.log("Loading anime with id:", id);
                    try {
                        const animeData = await animeApi.get(id);
                        console.log("Loaded anime data:", animeData);
                        if (animeData) {
                            const { id: _, ...animeWithoutId } = animeData;
                            form.reset(animeWithoutId);
                            setAnimeId(id);
                            console.log("Form reset with anime data");
                        }
                    } catch (error) {
                        console.error("Ошибка при загрузке аниме:", error);
                        alert("Не удалось загрузить данные аниме");
                    }
                } else {
                    console.log("Empty id, resetting form to create mode");
                    form.reset({
                        name: "",
                        score: 0,
                        review: "",
                        link: "",
                        status: AnimeStatus.None,
                    });
                    setAnimeId(undefined);
                }
            });
            return unlisten;
        };

        const unlistenPromise = setupListener();

        return () => {
            unlistenPromise.then((unlisten) => unlisten());
        };
    }, [form]);

    const onSubmit = async (data: Anime) => {
        try {
            console.log("Submitting anime data:", data);

            if (animeId) {
                // Режим редактирования
                const animeWithId: AnimeWithId = {
                    id: animeId,
                    ...data,
                };
                console.log("Updating anime:", animeWithId);

                const updated = await animeApi.update(animeWithId);
                console.log("Update successful:", updated);

                await emit("anime-updated", updated.id);
                setAnimeId(undefined);
                await getCurrentWindow().hide();
            } else {
                // Режим создания
                console.log("Creating new anime with data:", data);

                const newAnime = await animeApi.create(
                    data.name,
                    data.score,
                    data.review,
                    data.link,
                    data.status
                );

                console.log("Create successful, new ID:", newAnime.id);

                await emit("anime-updated", newAnime.id);
                setAnimeId(undefined);

                await getCurrentWindow().hide();
            }
        } catch (error) {
            console.error("Ошибка при сохранении аниме:", error);
            console.error("Тип ошибки:", typeof error);
            console.error("Полный объект ошибки:", error);

            // Попробуем получить больше информации об ошибке
            let errorMessage = "Не удалось сохранить аниме.";

            if (error instanceof Error) {
                errorMessage += ` Ошибка: ${error.message}`;
            } else if (typeof error === "string") {
                errorMessage += ` Ошибка: ${error}`;
            } else if (error && typeof error === "object") {
                try {
                    errorMessage += ` Ошибка: ${JSON.stringify(error)}`;
                } catch {
                    errorMessage += ` Неизвестная ошибка: ${String(error)}`;
                }
            }

            alert(errorMessage);
        }
    };

    return (
        <div
            className={cn("flex w-screen h-screen p-4 gap-4", className)}
            onContextMenu={(e) => e.preventDefault()}
            {...props}
        >
            <div className="flex-1">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                        autoComplete="off"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Название</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Введите название аниме"
                                            autoComplete="off"
                                            {...field}
                                        />
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
                                        <Input
                                            placeholder="https://..."
                                            autoComplete="off"
                                            {...field}
                                        />
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
                                        <Textarea
                                            placeholder="Напишите свой отзыв..."
                                            autoComplete="off"
                                            {...field}
                                        />
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

            <AnimeImage
                animeId={animeId}
                link={!animeId ? form.watch("link") : undefined}
                className="flex-1"
            />
        </div>
    );
};

export default DetailsWindow;
