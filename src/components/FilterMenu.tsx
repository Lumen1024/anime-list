import { cn } from "@/lib/utils";
import { AnimeStatus } from "@/model/AnimeStatus";
import { AnimeStatusIcon } from "./AnimeStatusIcon";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

export type FilterStatus = AnimeStatus[];

interface FilterMenuProps extends Omit<ComponentProps<"div">, "onChange"> {
    value?: FilterStatus;
    onChange?: (value: FilterStatus) => void;
}

const ALL_STATUSES: AnimeStatus[] = [
    AnimeStatus.Completed,
    AnimeStatus.Waiting,
    AnimeStatus.Dropped,
    AnimeStatus.None,
];

export const FilterMenu = ({
    className,
    value = [],
    onChange,
    ...props
}: FilterMenuProps) => {
    const selectedStatuses = value.length === 0 ? ALL_STATUSES : value;

    const handleToggleStatus = (status: AnimeStatus) => {
        let newSelected: AnimeStatus[];
        if (selectedStatuses.includes(status)) {
            // Убираем статус
            newSelected = selectedStatuses.filter(s => s !== status);
        } else {
            // Добавляем статус
            newSelected = [...selectedStatuses, status];
        }
        // Если после удаления остался пустой массив, значит выбраны все (эквивалентно пустому)
        // Но мы можем передать пустой массив как "все"
        onChange?.(newSelected);
    };

    const statusOptions: { value: AnimeStatus; label: string; icon?: React.ReactNode }[] = [
        { value: AnimeStatus.Completed, label: 'Просмотрено', icon: <AnimeStatusIcon status={AnimeStatus.Completed} /> },
        { value: AnimeStatus.Waiting, label: 'В ожидании', icon: <AnimeStatusIcon status={AnimeStatus.Waiting} /> },
        { value: AnimeStatus.Dropped, label: 'Брошено', icon: <AnimeStatusIcon status={AnimeStatus.Dropped} /> },
        { value: AnimeStatus.None, label: 'Без статуса', icon: <AnimeStatusIcon status={AnimeStatus.None} /> },
    ];


    return (
        <div className={cn("flex items-center gap-2 pl-4 pr-4", className)} {...props}>
            {statusOptions.map((option) => {
                const isSelected = selectedStatuses.includes(option.value);
                return (
                    <Button
                        key={option.value}
                        size={"icon"}
                        variant={isSelected ? "outline" : "ghost"}
                        onClick={() => handleToggleStatus(option.value)}
                        className="p-4 gap-4"
                    >
                        {option.icon}
                    </Button>
                );
            })}
        </div>
    );
};