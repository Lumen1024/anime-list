import "@/App.css";
import { AnimeListItem } from "@/components/AnimeListItem";
import { SearchBar } from "@/components/SearchBar";
import { FilterMenu, type FilterStatus } from "@/components/FilterMenu";
import { ExportImportButtons } from "@/components/ExportImportButtons";
import { Plus } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { animeApi, type AnimeWithId } from "@/api/anime";
import {
    useState,
    useEffect,
    useMemo,
    useOptimistic,
    useCallback,
} from "react";
import { Button } from "@/components/ui/button";
import { Anime } from "@/model/Anime";
import type { AnimeStatus } from "@/model/AnimeStatus";

type OptimisticAction =
    | { type: "delete"; id: string }
    | { type: "update"; anime: AnimeWithId }
    | { type: "add"; anime: Anime };

function App() {
    const [animes, setAnimes] = useState<AnimeWithId[]>([]);
    const [query, setQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<FilterStatus>([]);
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
            optimisticAnimes.filter((anime) => {
                const matchesQuery = anime.name.toLowerCase().includes(query.toLowerCase());
                const matchesStatus = filterStatus.length === 0 || filterStatus.includes(anime.status);
                return matchesQuery && matchesStatus;
            }),
        [optimisticAnimes, query, filterStatus]
    );

    const sortedAnimes = useMemo(() => {
        const arr = [...filteredAnimes];
        // Сортировка по рейтингу (убывание), затем по названию (возрастание)
        arr.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return a.name.localeCompare(b.name);
        });
        return arr;
    }, [filteredAnimes]);

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

    useEffect(() => {
        const setupListener = async () => {
            const unlisten = await listen<string>(
                "anime-updated",
                async (event) => {
                    console.log("Anime updated event received");

                    if (event.payload) {
                        const updatedAnime = await animeApi.get(event.payload);
                        if (updatedAnime) {
                            setAnimes((prev) => {
                                const exists = prev.some(
                                    (a) => a.id === updatedAnime.id
                                );
                                if (exists) {
                                    return prev.map((a) =>
                                        a.id === updatedAnime.id
                                            ? updatedAnime
                                            : a
                                    );
                                } else {
                                    return [...prev, updatedAnime];
                                }
                            });
                        }
                    } else {
                        await loadAnimes();
                    }
                }
            );

            return unlisten;
        };

        const unlistenPromise = setupListener();

        return () => {
            unlistenPromise.then((unlisten) => unlisten());
        };
    }, [loadAnimes]);

    const onAddClicked = useCallback(async (animeId?: string) => {
        try {
            console.log("onAddClicked called with animeId:", animeId);
            await invoke("show_details_window", { animeId });
        } catch (error) {
            console.error("Ошибка при открытии окна Details:", error);
        }
    }, []);

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

    const onScoreChanged = useCallback(
        async (id: string, score: number) => {
            const anime = animes.find((a) => a.id === id);
            if (!anime) return;

            const updatedAnime = { ...anime, score };
            updateOptimisticAnimes({ type: "update", anime: updatedAnime });

            try {
                const result = await animeApi.update(updatedAnime);
                setAnimes((prev) =>
                    prev.map((a) => (a.id === id ? result : a))
                );
            } catch (error) {
                console.error("Ошибка обновления оценки:", error);
                await loadAnimes();
            }
        },
        [animes, loadAnimes]
    );

    const onStatusChanged = useCallback(
        async (id: string, status: AnimeStatus) => {
            const anime = animes.find((a) => a.id === id);
            if (!anime) return;

            const updatedAnime = { ...anime, status };
            updateOptimisticAnimes({ type: "update", anime: updatedAnime });

            try {
                const result = await animeApi.update(updatedAnime);
                setAnimes((prev) =>
                    prev.map((a) => (a.id === id ? result : a))
                );
            } catch (error) {
                console.error("Ошибка обновления статуса:", error);
                await loadAnimes();
            }
        },
        [animes, loadAnimes]
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
                <FilterMenu
                    value={filterStatus}
                    onChange={setFilterStatus}
                />
                <ExportImportButtons onImportComplete={loadAnimes} />
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
                ) : sortedAnimes.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                        {query
                            ? "Ничего не найдено"
                            : "Список пуст. Добавьте аниме!"}
                    </div>
                ) : (
                    sortedAnimes.map((anime) => (
                        <AnimeListItem
                            key={anime.id}
                            anime={anime}
                            onItemClick={onAnimeClick}
                            onDelete={onDeleteClicked}
                            onScoreChange={onScoreChanged}
                            onStatusChange={onStatusChanged}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default App;
