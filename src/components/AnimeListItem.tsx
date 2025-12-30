import { AnimeStatusIcon } from "@/components/AnimeStatusIcon"
import { AnimeStatusSelect } from "@/components/AnimeStatusSelect"
import { ScoreSelect } from "@/components/ScoreSelect"
import type { AnimeWithId } from "@/api/anime"
import type { AnimeStatus } from "@/model/AnimeStatus"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"
import { useState } from "react"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Trash2 } from "lucide-react"

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
        <ContextMenu>
            <ContextMenuTrigger asChild>
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
                        <button
                            type="button"
                            onClick={() => onEdit?.(anime.id)}
                            className="flex-1 text-foreground truncate text-left hover:text-primary transition-colors"
                        >
                            {anime.name}
                        </button>
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
                    </div>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                {onDelete && (
                    <ContextMenuItem
                        onClick={() => onDelete(anime.id)}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Удалить
                    </ContextMenuItem>
                )}
            </ContextMenuContent>
        </ContextMenu>
    )
}
