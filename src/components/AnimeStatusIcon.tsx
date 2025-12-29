import { AnimeStatus } from "@/model/AnimeStatus";
import { Check, X, Clock, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

interface AnimeStatusIconProps extends ComponentProps<"div"> {
  status: AnimeStatus;
}

export const AnimeStatusIcon = ({ status, className, ...props }: AnimeStatusIconProps) => {
  const iconClass = "w-5 h-5 flex-shrink-0";

  const getIcon = () => {
    switch (status) {
      case AnimeStatus.Completed:
        return <Check className={cn(iconClass, "text-green-500")} />;
      case AnimeStatus.Dropped:
        return <X className={cn(iconClass, "text-red-500")} />;
      case AnimeStatus.Waiting:
        return <Clock className={cn(iconClass, "text-yellow-500")} />;
      case AnimeStatus.None:
      default:
        return <Minus className={cn(iconClass, "text-muted-foreground")} />;
    }
  };

  return (
    <div
      className={cn("", className)}
      {...props}
    >
      {getIcon()}
    </div>
  );
}
