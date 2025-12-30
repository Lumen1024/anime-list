import { cn } from "@/lib/utils"
import { AnimeStatus } from "@/model/AnimeStatus"
import { AnimeStatusIcon } from "./AnimeStatusIcon"
import type { ComponentProps } from "react"

interface AnimeStatusSelectProps extends Omit<ComponentProps<"div">, "onChange"> {
    value?: AnimeStatus
    onChange?: (value: AnimeStatus) => void
}

export const AnimeStatusSelect = ({
    className,
    value = AnimeStatus.None,
    onChange,
    ...props
}: AnimeStatusSelectProps) => {
    const handleClick = (status: AnimeStatus) => {
        if (onChange) onChange(status)
    }

    const statuses = [
        AnimeStatus.Completed,
        AnimeStatus.Waiting,
        AnimeStatus.Dropped,
        AnimeStatus.None,
    ]

    return (
        <div
            className={cn("flex gap-2", className)}
            {...props}
        >
            {statuses.map((status) => (
                <button
                    key={status}
                    type="button"
                    onClick={() => handleClick(status)}
                    className={cn(
                        "p-2 rounded-md transition-all hover:bg-accent",
                        value === status && "bg-accent ring-2 ring-ring",
                    )}
                >
                    <AnimeStatusIcon status={status} />
                </button>
            ))}
        </div>
    )
}
