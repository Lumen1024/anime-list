import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import type { ComponentProps } from "react";

interface ScoreSelectProps extends Omit<ComponentProps<"div">, "onChange"> {
    value?: number;
    onChange?: (value: number) => void;
}

export const ScoreSelect = ({
    className,
    value = 0,
    onChange,
    ...props
}: ScoreSelectProps) => {
    const handleClick = (score: number) => {
        if (onChange) onChange(score);
    };

    return (
        <div className={cn("flex gap-1", className)} {...props}>
            {[1, 2, 3, 4, 5].map((score) => (
                <Star
                    key={score}
                    className={cn(
                        "w-6 h-6 transition-colors",
                        score <= value
                            ? "fill-chart-2 text-chart-2"
                            : "text-ring"
                    )}
                    onClick={() => handleClick(score)}
                />
            ))}
        </div>
    );
};
