import { AnimeStatusIcon } from "@/components/AnimeStatusIcon";
import { AnimeStatusSelect } from "@/components/AnimeStatusSelect";
import { ScoreSelect } from "@/components/ScoreSelect";
import type { AnimeWithId } from "@/api/anime";
import type { AnimeStatus } from "@/model/AnimeStatus";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { useState, useCallback } from "react";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnimeListItemProps extends ComponentProps<"div"> {
    anime: AnimeWithId;
    onItemClick?: (id: string) => void;
    onDelete?: (id: string) => void;
    onScoreChange?: (id: string, score: number) => void;
    onStatusChange?: (id: string, status: AnimeStatus) => void;
}

export const AnimeListItem = ({
    anime,
    onItemClick,
    onDelete,
    onScoreChange,
    onStatusChange,
    className,
    ...props
}: AnimeListItemProps) => {
    const [isStatusSelectOpen, setIsStatusSelectOpen] = useState(false);

    const handleStatusChange = useCallback(
        (status: AnimeStatus) => {
            if (onStatusChange) {
                onStatusChange(anime.id, status);
            }
            setIsStatusSelectOpen(false);
        },
        [anime.id, onStatusChange]
    );

    const handleScoreChange = useCallback(
        (score: number) => {
            if (onScoreChange) {
                const newScore = anime.score === score ? 0 : score;
                onScoreChange(anime.id, newScore);
            }
        },
        [anime.id, anime.score, onScoreChange]
    );

    const handleClick = useCallback(() => {
        if (onItemClick) {
            onItemClick(anime.id);
        }
    }, [anime.id, onItemClick]);

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <div
                    className={cn(
                        "p-2 h-10 flex items-center justify-between rounded bg-accent transition-colors gap-2 cursor-pointer",
                        className
                    )}
                    onClick={handleClick}
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
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsStatusSelectOpen(true);
                                }}
                            >
                                <AnimeStatusIcon status={anime.status} />
                            </Button>
                        )}
                        <div className="truncate">{anime.name}</div>
                    </div>

                    <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                    >
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
    );
};
