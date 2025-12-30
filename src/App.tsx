import "@/App.css";
import { AnimeListItem } from "@/components/AnimeListItem";
import { SearchBar } from "@/components/SearchBar";
import { Filter, Plus } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { animeApi, type AnimeWithId } from "@/api/anime";
import {
    useState,
    useEffect,
    useMemo,
    useOptimistic,
    useCallback,
} from "react";
import { Button } from "@/components/ui/button";

type OptimisticAction =
    | { type: "delete"; id: string }
    | { type: "update"; anime: AnimeWithId };

function App() {
    const [animes, setAnimes] = useState<AnimeWithId[]>([]);
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const [optimisticAnimes, updateOptimisticAnimes] = useOptimistic(
        animes,
        (state, action: OptimisticAction) => {
            if (action.type === "delete") {
                return state.filter((anime) => anime.id !== action.id);
            }
            if (action.type === "update") {
                const index = state.findIndex((a) => a.id === action.anime.id);
                if (index === -1) return [...state, action.anime];
                const newState = [...state];
                newState[index] = action.anime;
                return newState;
            }
            return state;
        }
    );

    const filteredAnimes = useMemo(
        () =>
            optimisticAnimes.filter((anime) =>
                anime.name.toLowerCase().includes(query.toLowerCase())
            ),
        [optimisticAnimes, query]
    );

    const loadAnimes = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await animeApi.list();
            setAnimes(data);
        } catch (error) {
            console.error("Ошибка загрузки аниме:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAnimes();
    }, [loadAnimes]);

    const onAddClicked = useCallback(
        async (animeId?: string) => {
            try {
                await invoke("open_details_window", { animeId });
                setTimeout(() => loadAnimes(), 500);
            } catch (error) {
                console.error("Ошибка при открытии окна Details:", error);
            }
        },
        [loadAnimes]
    );

    const onAnimeClick = useCallback(
        async (id: string) => {
            await onAddClicked(id);
        },
        [onAddClicked]
    );

    const onDeleteClicked = useCallback(
        async (id: string) => {
            updateOptimisticAnimes({ type: "delete", id });

            try {
                await animeApi.delete(id);
                setAnimes((prev) => prev.filter((anime) => anime.id !== id));
            } catch (error) {
                console.error("Ошибка удаления аниме:", error);
                await loadAnimes();
            }
        },
        [loadAnimes]
    );

    const onSearchChanged = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
        },
        []
    );

    return (
        <div className="flex flex-col w-screen h-screen p-4 gap-4">
            <div className="flex w-full gap-2">
                <SearchBar
                    className="flex-1"
                    placeholder="Поиск аниме..."
                    value={query}
                    onChange={onSearchChanged}
                />
                <Button size={"icon"} variant={"outline"}>
                    <Filter className="text-muted-foreground" />
                </Button>
                <Button
                    size={"icon"}
                    variant={"outline"}
                    onClick={() => onAddClicked()}
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
                        {query
                            ? "Ничего не найдено"
                            : "Список пуст. Добавьте аниме!"}
                    </div>
                ) : (
                    filteredAnimes.map((anime) => (
                        <AnimeListItem
                            key={anime.id}
                            anime={anime}
                            onEdit={onAnimeClick}
                            onDelete={onDeleteClicked}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default App;
