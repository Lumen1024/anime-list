import { AnimeStatusIcon } from "@/components/AnimeStatusIcon"
import { AnimeStatusSelect } from "@/components/AnimeStatusSelect"
import { ScoreSelect } from "@/components/ScoreSelect"
import type { AnimeWithId } from "@/api/anime"
import type { AnimeStatus } from "@/model/AnimeStatus"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { useState } from "react"

interface AnimeListItemProps extends ComponentProps<"div"> {
    anime: AnimeWithId
    onEdit?: (id: string) => void
    onDelete?: (id: string) => void
    onScoreChange?: (id: string, score: number) => void
    onStatusChange?: (id: string, status: AnimeStatus) => void
}

export const AnimeListItem = ({
    anime,
    onEdit,
    onDelete,
    onScoreChange,
    onStatusChange,
    className,
    ...props
}: AnimeListItemProps) => {
    const [isStatusSelectOpen, setIsStatusSelectOpen] = useState(false)
    const [isScoreSelectOpen, setIsScoreSelectOpen] = useState(false)

    const handleStatusChange = (status: AnimeStatus) => {
        if (onStatusChange) {
            onStatusChange(anime.id, status)
        }
        setIsStatusSelectOpen(false)
    }

    const handleScoreChange = (score: number) => {
        if (onScoreChange) {
            onScoreChange(anime.id, score)
        }
        setIsScoreSelectOpen(false)
    }

    return (
        <div
            className={cn(
                "p-2 h-10 flex items-center justify-between rounded bg-accent transition-colors gap-2",
                className
            )}
            {...props}
        >
            <div className="flex flex-row gap-2 items-center flex-1 min-w-0">
                {isStatusSelectOpen ? (
                    <AnimeStatusSelect
                        value={anime.status}
                        onChange={handleStatusChange}
                    />
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsStatusSelectOpen(true)}
                        className="hover:bg-background/50 rounded p-1 transition-colors"
                    >
                        <AnimeStatusIcon status={anime.status} />
                    </button>
                )}
                <span className="flex-1 text-foreground truncate">{anime.name}</span>
            </div>

            <div className="flex items-center gap-2">
                {isScoreSelectOpen ? (
                    <ScoreSelect
                        value={anime.score}
                        onChange={handleScoreChange}
                    />
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsScoreSelectOpen(true)}
                        className="hover:bg-background/50 rounded px-2 py-1 transition-colors"
                    >
                        <span className="text-sm">{"⭐".repeat(anime.score)}</span>
                    </button>
                )}

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
