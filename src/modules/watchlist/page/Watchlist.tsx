import { useCallback } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { useWatchlistStore } from "../store/watchlistStore";
import { WatchlistTable } from "../components/WatchlistTable";
import type { Movie } from "@/types";

const Watchlist = () => {
  const movies = useWatchlistStore((s) => s.movies);
  const toggle = useWatchlistStore((s) => s.toggle);

  const handleRemove = useCallback(
    (movie: Movie) => {
      toggle(movie);
      toast.success("Removido da sua lista");
    },
    [toggle],
  );

  if (movies.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">Minha Lista</h1>
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
          <Bookmark className="h-10 w-10 opacity-40" />
          <p className="text-sm">Nenhum filme salvo ainda.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">
        Minha Lista
        <span className="ml-2 text-base font-normal text-muted-foreground">
          ({movies.length} {movies.length === 1 ? "filme" : "filmes"})
        </span>
      </h1>
      <WatchlistTable movies={movies} onRemove={handleRemove} />
    </div>
  );
};

export default Watchlist;
