import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Star,
  Clock,
  Calendar,
  Bookmark,
  BookmarkCheck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWatchlistStore } from "@/store/watchlistStore";
import { useMovieDetail } from "../hooks/useMovieDetail";
import { toast } from "sonner";

interface Props {
  id: number;
}

export function MovieDetail({ id }: Props) {
  const { data: movie, isLoading, isError } = useMovieDetail(id);
  const inList = useWatchlistStore((s) => s.movies.some((m) => m.id === id));
  const toggle = useWatchlistStore((s) => s.toggle);

  if (isLoading) return <MovieDetailSkeleton />;

  if (isError || !movie) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold">Filme não encontrado</h1>
        <Button asChild className="mt-6">
          <Link to="/dashboard">Voltar à descoberta</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-[420px] w-full overflow-hidden">
        {movie.backdrop ? (
          <img
            src={movie.backdrop}
            alt=""
            className="h-full w-full object-cover opacity-30"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
      </div>

      <main className="relative mx-auto -mt-64 max-w-7xl px-6 pb-16">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>

        <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
          <img
            src={movie.poster}
            alt={movie.title}
            className="aspect-[2/3] w-full rounded-xl border border-border/60 object-cover shadow-[var(--shadow-gold)]"
          />

          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary">
                {movie.genre}
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight lg:text-5xl">
                {movie.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 text-primary">
                  <Star className="h-4 w-4 fill-primary" />
                  <span className="font-semibold">
                    {movie.rating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">/ 10</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {movie.year}
                </span>
                {movie.runtime > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {movie.runtime} min
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  Dir. {movie.director}
                </span>
              </div>
            </div>

            <Button
              size="lg"
              variant={inList ? "outline" : "default"}
              onClick={() => {
                toggle(movie);
                toast.success(
                  inList ? "Removido da sua lista" : "Adicionado à sua lista",
                );
              }}
            >
              {inList ? (
                <>
                  <BookmarkCheck className="h-4 w-4 cursor-pointer" />
                  Na sua lista
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4 cursor-pointer" />
                  Adicionar à lista
                </>
              )}
            </Button>

            {movie.overview && (
              <section>
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Sinopse
                </h2>
                <p className="text-base leading-relaxed text-foreground/90">
                  {movie.overview}
                </p>
              </section>
            )}

            {movie.cast.length > 0 && (
              <section>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Elenco principal
                </h2>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((name) => (
                    <span
                      key={name}
                      className="rounded-full border border-border/60 bg-card/60 px-3 py-1 text-sm"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {movie.trailer && (
              <section>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Trailer
                </h2>
                <div className="aspect-video w-full overflow-hidden rounded-xl border border-border/60 bg-muted">
                  <iframe
                    src={movie.trailer}
                    title={`${movie.title} — trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function MovieDetailSkeleton() {
  return (
    <div>
      <Skeleton className="h-[420px] w-full rounded-none" />
      <div className="mx-auto -mt-64 max-w-7xl px-6 pb-16">
        <Skeleton className="mb-6 h-8 w-20" />
        <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
          <Skeleton className="aspect-[2/3] w-full rounded-xl" />
          <div className="space-y-4 pt-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-16" />
              ))}
            </div>
            <Skeleton className="h-10 w-40" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
