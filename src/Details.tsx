import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

interface DetailsProps extends ComponentProps<"div"> {

}

export const Details = ({ className, ...props }: DetailsProps) => {
    return (
        <div
            className={cn("flex flex-col w-screen h-screen p-6 gap-4", className)}
            {...props}
        >
            <h1 className="text-2xl font-bold">Детали аниме</h1>
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">
                    Это окно Details - пример второго окна в Tauri приложении
                </p>
                <div className="mt-4 p-4 border rounded-lg">
                    <h2 className="font-semibold mb-2">Информация:</h2>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Каждое окно может иметь свой собственный UI</li>
                        <li>Окна могут общаться через Tauri API</li>
                        <li>Можно создавать окна динамически из кода</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Details
