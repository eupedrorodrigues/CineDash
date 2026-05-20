import { Link } from "@tanstack/react-router";
import { Star, Bookmark, BookmarkCheck } from "lucide-react";
import { useWatchlistStore } from "@/store/watchlistStore";
import type { Movie } from "@/types";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export function MovieCard({ movie }: { movie: Movie }) {
  const inList = useWatchlistStore((s) => s.movies.some((m) => m.id === movie.id));
  const toggle = useWatchlistStore((s) => s.toggle);

  return (
    <Card className="group relative overflow-hidden rounded-lg border border-border/60 bg-card transition-all hover:border-primary/40 hover:shadow-[var(--shadow-gold)]">
      <Link to="/movie/$id" params={{ id: String(movie.id) }} className="block">
        <div className="relative aspect-[2/3] overflow-hidden bg-muted">
          <img
            src={movie.poster}
            alt={movie.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80" />
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-xs font-semibold text-primary backdrop-blur">
            <Star className="h-3 w-3 fill-primary" />
            {movie.rating.toFixed(1)}
          </div>
        </div>
        <div className="space-y-1 p-3">
          <h3 className="line-clamp-1 text-sm font-semibold tracking-tight text-foreground">
            {movie.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {movie.genre} · {movie.year}
          </p>
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          toggle(movie);
          toast.success(inList ? "Removido da sua lista" : "Adicionado à sua lista");
        }}
        className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground"
        aria-label={inList ? "Remover da lista" : "Adicionar à lista"}
      >
        {inList ? (
          <BookmarkCheck className="h-4 w-4" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
      </button>
    </Card>
  );
}
