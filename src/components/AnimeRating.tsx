import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

interface AnimeRatingProps extends ComponentProps<"div"> {
    score: number;
    maxScore?: number;
}

export const AnimeRating = ({
    score,
    maxScore = 5,
    className,
    ...props
}: AnimeRatingProps) => {
    return (
        <div className={cn("flex gap-0.5", className)} {...props}>
            {Array.from({ length: maxScore }).map((_, index) => (
                <Star
                    key={index}
                    className={cn(
                        "w-4 h-4",
                        index < score
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                    )}
                />
            ))}
        </div>
    );
};
