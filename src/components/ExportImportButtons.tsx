import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { animeApi, type AnimeWithId } from "@/api/anime";
import { useCallback } from "react";

interface ExportImportButtonsProps {
    onImportComplete?: () => void;
}

export const ExportImportButtons = ({ onImportComplete }: ExportImportButtonsProps) => {
    const handleExport = useCallback(async () => {
        try {
            const animes = await animeApi.list();
            const dataStr = JSON.stringify(animes, null, 2);
            const dataBlob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(dataBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `anime-list-${new Date().toISOString().split("T")[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Ошибка экспорта:", error);
            alert("Не удалось экспортировать список аниме");
        }
    }, []);

    const handleImport = useCallback(async () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (!file) return;

            try {
                const text = await file.text();
                const parsed = JSON.parse(text) as AnimeWithId[];
                // Валидация: должен быть массив объектов с полями name, score и т.д.
                if (!Array.isArray(parsed)) {
                    throw new Error("Файл должен содержать массив аниме");
                }
                // Для каждого аниме создаем запись в БД (или обновляем, если есть id?)
                // Пока просто создаем новые записи, игнорируя id.
                for (const anime of parsed) {
                    const { id, ...animeData } = anime;
                    await animeApi.create(
                        animeData.name,
                        animeData.score,
                        animeData.review,
                        animeData.link,
                        animeData.status
                    );
                }
                alert(`Успешно импортировано ${parsed.length} аниме`);
                onImportComplete?.();
            } catch (error) {
                console.error("Ошибка импорта:", error);
                alert("Не удалось импортировать файл. Проверьте формат JSON.");
            }
        };
        input.click();
    }, [onImportComplete]);

    return (
        <div className="flex items-center gap-2 text-muted-foreground">
            <Button
                size="icon"
                variant="outline"
                onClick={handleExport}
                title="Экспорт списка в JSON"
            >
                <Download className="h-4 w-4" />
            </Button>
            <Button
                size="icon"
                variant="outline"
                onClick={handleImport}
                title="Импорт списка из JSON"
            >
                <Upload className="h-4 w-4" />
            </Button>
        </div>
    );
};