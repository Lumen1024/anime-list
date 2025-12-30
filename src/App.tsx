import "@/App.css";
import { AnimeListItem } from "@/components/AnimeListItem";
import { SearchBar } from "@/components/SearchBar";
import { Filter, Plus } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { animeApi, type AnimeWithId } from "@/api/anime";
import { useState, useEffect, useMemo, useOptimistic } from "react";
import { Button } from "@/components/ui/button";

function App() {
    const [animes, setAnimes] = useState<AnimeWithId[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const [optimisticAnimes, updateOptimisticAnimes] = useOptimistic(
        animes,
        (state, newAnime) => [...state]
    );

    const filteredAnimes = useMemo(
        () =>
            animes.filter((anime) =>
                anime.name.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        [animes, searchQuery]
    );

    const loadAnimes = async () => {
        try {
            setIsLoading(true);
            const data = await animeApi.list();
            setAnimes(data);
        } catch (error) {
            console.error("Ошибка загрузки аниме:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAnimes();
    }, []);

    const handleOpenDetails = async (animeId?: string) => {
        try {
            await invoke("open_details_window", { animeId });
            // Перезагружаем список после закрытия окна
            setTimeout(() => loadAnimes(), 500);
        } catch (error) {
            console.error("Ошибка при открытии окна Details:", error);
        }
    };

    const handleEditAnime = async (id: string) => {
        await handleOpenDetails(id);
    };

    const handleDeleteAnime = async (id: string) => {
        try {
            await animeApi.delete(id);
            await loadAnimes();
        } catch (error) {
            console.error("Ошибка удаления аниме:", error);
        }
    };

    return (
        <div className="flex flex-col w-screen h-screen p-4 gap-4">
            <div className="flex w-full gap-2">
                <SearchBar
                    className="flex-1"
                    placeholder="Поиск аниме..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button size={"icon"} variant={"outline"}>
                    <Filter className="text-muted-foreground" />
                </Button>
                <Button
                    size={"icon"}
                    variant={"outline"}
                    onClick={() => handleOpenDetails()}
                    title="Добавить аниме"
                >
                    <Plus className="text-muted-foreground" />
                </Button>
            </div>
            <div className="flex flex-col w-full gap-2 overflow-y-auto">
                {isLoading ? (
                    <div className="text-center text-muted-foreground py-8">
                        Загрузка...
                    </div>
                ) : filteredAnimes.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                        {searchQuery
                            ? "Ничего не найдено"
                            : "Список пуст. Добавьте аниме!"}
                    </div>
                ) : (
                    filteredAnimes.map((anime) => (
                        <AnimeListItem
                            key={anime.id}
                            anime={anime}
                            onEdit={handleEditAnime}
                            onDelete={handleDeleteAnime}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default App;
