import "@/App.css";
import { AnimeListItem } from "@/components/AnimeListItem";
import { Anime } from "@/model/Anime";
import { AnimeStatus } from "@/model/AnimeStatus";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "./components/ui/button";
import { Filter, Info } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const exampleAnimes: Anime[] = [
    {
      name: "Стальной алхимик",
      score: 5,
      review: "Отличное аниме",
      link: "https://example.com",
      status: AnimeStatus.Completed,
    },
    {
      name: "Атака титанов",
      score: 4,
      review: "Очень хорошо",
      link: "https://example.com",
      status: AnimeStatus.Waiting,
    },
    {
      name: "Наруто",
      score: 3,
      review: "Нормально",
      link: "https://example.com",
      status: AnimeStatus.Dropped,
    },
    {
      name: "Ван Пис",
      score: 0,
      review: "",
      link: "https://example.com",
      status: AnimeStatus.None,
    },
  ];

  const handleOpenDetails = async () => {
    try {
      await invoke("open_details_window");
    } catch (error) {
      console.error("Ошибка при открытии окна Details:", error);
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen p-4 gap-4">
      <div className="flex w-full gap-2 ">
        <SearchBar className="flex-1" />
        <Button size={"icon-sm"} className="bg-accent"> <Filter className="text-muted-foreground" /></Button>
        <Button size={"icon-sm"} className="bg-accent" onClick={handleOpenDetails} title="Открыть детали">
          <Info className="text-muted-foreground" />
        </Button>
      </div>
      <div className="flex flex-col w-full gap-2">
        {exampleAnimes.map((anime, index) => (
          <AnimeListItem key={index} anime={anime} />
        ))}
      </div>
    </div>
  );
}

export default App;
