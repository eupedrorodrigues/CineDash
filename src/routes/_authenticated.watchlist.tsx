import { createFileRoute } from "@tanstack/react-router";
import { useWatchlistStore } from "@/store/watchlistStore";
import { MovieCard } from "@/components/MovieCard/MovieCard";
import { Bookmark } from "lucide-react";

function WatchlistPage() {
  const movies = useWatchlistStore((s) => s.movies);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Minha Lista</h1>

      {movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
          <Bookmark className="h-10 w-10 opacity-40" />
          <p className="text-sm">Nenhum filme salvo ainda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/watchlist")({
  component: WatchlistPage,
});
