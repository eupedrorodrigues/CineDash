import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bookmark, Trash2, Eye } from "lucide-react";
import { useWatchlistStore } from "../store/watchlistStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SortableHeader, sortMovies } from "../components/SortableHeader";
import type { SortDir, SortKey } from "@/types/watchlist";

const Watchlist = () => {
  const movies = useWatchlistStore((s) => s.movies);
  const toggle = useWatchlistStore((s) => s.toggle);

  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = sortMovies(movies, sortKey, sortDir);

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

      <div className="overflow-hidden rounded-xl border border-border/60">
        <table className="w-full text-sm">
          <thead className="border-b border-border/60 bg-card/60">
            <tr>
              <SortableHeader
                label="Título"
                col="title"
                active={sortKey}
                dir={sortDir}
                onSort={handleSort}
              />
              <SortableHeader
                label="Gênero"
                col="genre"
                active={sortKey}
                dir={sortDir}
                onSort={handleSort}
              />
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Ano
              </th>
              <SortableHeader
                label="Nota"
                col="rating"
                active={sortKey}
                dir={sortDir}
                onSort={handleSort}
              />
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {sorted.map((movie) => (
              <tr
                key={movie.id}
                className="bg-background transition-colors hover:bg-card/60"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="h-12 w-8 rounded object-cover"
                    />
                    <span className="line-clamp-1 font-medium">
                      {movie.title}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {movie.genre}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {movie.year}
                </td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-primary">
                    {movie.rating.toFixed(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link to="/movie/$id" params={{ id: String(movie.id) }}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        toggle(movie);
                        toast.success("Removido da sua lista");
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Watchlist;
