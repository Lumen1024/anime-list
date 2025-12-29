import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"
import { Input } from "@/components/ui/input"

interface SearchBarProps extends ComponentProps<"input"> {}

export const SearchBar = ({ className, ...props }: SearchBarProps) => {
    return (
        <div className={cn("relative", className)}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
                type="text"
                className="pl-10"
                {...props}
            />
        </div>
    )
}
