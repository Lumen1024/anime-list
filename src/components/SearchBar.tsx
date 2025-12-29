import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

interface SearchBarProps extends ComponentProps<"input"> { }

export const SearchBar = ({ className, ...props }: SearchBarProps) => {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        className="w-full h-8 pl-10 pr-4 rounded bg-accent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        {...props}
      />
    </div>
  );
};
