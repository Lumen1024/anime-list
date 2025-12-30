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
import { Button } from "@/components/ui/button"

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
                            <Button
                                size={"icon"}
                                variant={"ghost"}
                                onClick={() => setIsStatusSelectOpen(true)}
                            >
                                <AnimeStatusIcon status={anime.status} />
                            </Button>
                        )}
                        <div
                            onClick={() => onEdit?.(anime.id)}                        >
                            {anime.name}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <ScoreSelect
                            value={anime.score}
                            onChange={handleScoreChange}
                        />
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
