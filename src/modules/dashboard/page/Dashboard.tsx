import { useRef } from "react";
import { useInfiniteMovies } from "../hooks/useInfiniteMovies";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { MovieCard } from "@/components/MovieCard/MovieCard";
import { Loader } from "@/components/Loader/Loader";

const SENTINEL_OPTIONS: IntersectionObserverInit = { rootMargin: "200px" };

const Dashboard = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMovies();

  const sentinelRef = useRef<HTMLDivElement>(null);

  useIntersectionObserver(
    sentinelRef,
    () => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    SENTINEL_OPTIONS,
  );

  const movies = data?.pages.flatMap((p) => p.movies) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Filmes Populares</h1>

      {isError && (
        <p className="mb-4 text-destructive">Erro ao carregar filmes.</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {isLoading
          ? Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg bg-muted aspect-[2/3]"
              />
            ))
          : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>

      <div ref={sentinelRef} className="h-10 mt-4" />

      {isFetchingNextPage && (
        <div className="flex justify-center pb-8">
          <Loader className="h-6 w-6" />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
