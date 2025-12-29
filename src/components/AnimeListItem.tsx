import { AnimeStatusIcon } from "@/components/AnimeStatusIcon"
import { AnimeRating } from "@/components/AnimeRating"
import type { AnimeWithId } from "@/api/anime"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

interface AnimeListItemProps extends ComponentProps<"div"> {
    anime: AnimeWithId
    onEdit?: (id: string) => void
    onDelete?: (id: string) => void
}

export const AnimeListItem = ({
    anime,
    onEdit,
    onDelete,
    className,
    ...props
}: AnimeListItemProps) => {
    return (
        <div
            className={cn(
                "p-2 h-10 flex items-center justify-between rounded bg-accent transition-colors gap-2",
                className
            )}
            {...props}
        >
            <div className="flex flex-row gap-2 items-center flex-1 min-w-0">
                <AnimeStatusIcon status={anime.status} />
                <span className="flex-1 text-foreground truncate">{anime.name}</span>
            </div>

            <div className="flex items-center gap-2">
                <AnimeRating score={anime.score} />

                {onEdit && (
                    <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => onEdit(anime.id)}
                        title="Редактировать"
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                )}

                {onDelete && (
                    <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => onDelete(anime.id)}
                        title="Удалить"
                    >
                        <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                )}
            </div>
        </div>
    )
}
