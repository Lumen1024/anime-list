import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"
import { useEffect, useState } from "react"
import { animeApi } from "@/api/anime"

interface AnimeImageProps extends ComponentProps<"div"> {
    animeId?: string
    link?: string
}

export const AnimeImage = ({ className, animeId, link, ...props }: AnimeImageProps) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!animeId && !link) {
            setImageUrl(null)
            setError(null)
            return
        }

        const loadImage = async () => {
            try {
                setLoading(true)
                setError(null)

                const imageData = animeId
                    ? await animeApi.getImage(animeId)
                    : await animeApi.getImageByLink(link!)

                const blob = new Blob([new Uint8Array(imageData.imageData)], {
                    type: imageData.contentType,
                })
                const url = URL.createObjectURL(blob)
                setImageUrl(url)
            } catch (err) {
                console.error("Ошибка при загрузке изображения:", err)
                setError(err instanceof Error ? err.message : String(err))
            } finally {
                setLoading(false)
            }
        }

        loadImage()

        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl)
            }
        }
    }, [animeId, link])

    if (!animeId && !link) {
        return (
            <div
                className={cn(
                    "w-full h-full flex items-center justify-center bg-muted rounded-md text-muted-foreground",
                    className
                )}
                {...props}
            >
                Выберите аниме для отображения изображения
            </div>
        )
    }

    if (loading) {
        return (
            <div
                className={cn(
                    "w-full h-full flex items-center justify-center bg-muted rounded-md text-muted-foreground",
                    className
                )}
                {...props}
            >
                Загрузка изображения...
            </div>
        )
    }

    if (error) {
        return (
            <div
                className={cn(
                    "w-full h-full flex items-center justify-center bg-muted rounded-md text-destructive",
                    className
                )}
                {...props}
            >
                <div className="text-center">
                    <div>Ошибка загрузки изображения</div>
                    <div className="text-sm mt-2">{error}</div>
                </div>
            </div>
        )
    }

    if (!imageUrl) {
        return (
            <div
                className={cn(
                    "w-full h-full flex items-center justify-center bg-muted rounded-md text-muted-foreground",
                    className
                )}
                {...props}
            >
                Изображение недоступно
            </div>
        )
    }

    return (
        <div
            className={cn("w-full h-full flex items-center justify-center rounded-md overflow-hidden", className)}
            {...props}
        >
            <img
                src={imageUrl}
                alt="Anime cover"
                className="w-full h-full object-cover"
            />
        </div>
    )
}
