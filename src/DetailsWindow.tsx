import "@/App.css"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import type { ComponentProps } from "react"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ScoreSelect } from "@/components/ScoreSelect"

interface DetailsWindowProps extends ComponentProps<"div"> {
    animeId?: string
}

export const DetailsWindow = ({ className, animeId, ...props }: DetailsWindowProps) => {
    const form = useForm<Anime>({
        defaultValues: {
            name: "",
            score: 0,
            review: "",
            link: "",
            status: AnimeStatus.None,
        },
    })

    const onSubmit = (data: Anime) => {
        console.log(data)
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
                                    <Select
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        value={String(field.value)}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Выберите статус" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={String(AnimeStatus.None)}>Нет</SelectItem>
                                            <SelectItem value={String(AnimeStatus.Waiting)}>Ожидание</SelectItem>
                                            <SelectItem value={String(AnimeStatus.Completed)}>Завершено</SelectItem>
                                            <SelectItem value={String(AnimeStatus.Dropped)}>Брошено</SelectItem>
                                        </SelectContent>
                                    </Select>
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
