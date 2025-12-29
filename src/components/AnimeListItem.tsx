import { AnimeStatusIcon } from "@/components/AnimeStatusIcon";
import { AnimeRating } from "@/components/AnimeRating";
import { Anime } from "@/model/Anime";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

interface AnimeListItemProps extends ComponentProps<"div"> {
  anime: Anime;
}

export const AnimeListItem = ({ anime, className, ...props }: AnimeListItemProps) => {
  return (
    <div
      className={cn("p-2 h-8 flex items-center justify-between rounded bg-accent transition-colors", className)}
      {...props}
    >
      <div className="flex flex-row gap-2 items-center">
        <AnimeStatusIcon status={anime.status} />
        <span className="flex-1 text-foreground">{anime.name}</span>
      </div>

      <AnimeRating score={anime.score} />
    </div>
  );
}
