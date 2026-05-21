import { useRef } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useInfiniteMovies } from "../hooks/useInfiniteMovies";
import { useFilteredMovies } from "../hooks/useFilteredMovies";
import { useDashboardFilters } from "../hooks/useDashboardFilters";
import { TMDB_GENRES, YEARS } from "@/constants";
import { MovieCard } from "@/components/MovieCard/MovieCard";
import { Loader } from "@/components/Loader/Loader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useIntersectionObserver } from "@/hooks";
import { SENTINEL_OPTIONS } from "@/constants";
import { useWatchlistStore } from "@/modules/watchlist/store/watchlistStore";

const Dashboard = () => {
  const {
    query,
    setQuery,
    genre,
    setGenre,
    year,
    setYear,
    minRating,
    setMinRating,
    debouncedQuery,
    hasActiveFilters,
    genreId,
    activeFiltersCount,
    clearFilters,
  } = useDashboardFilters();

  const watchlistMovies = useWatchlistStore((s) => s.movies);
  const toggleWatchlist = useWatchlistStore((s) => s.toggle);

  const {
    data,
    isLoading: isLoadingPopular,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMovies(!hasActiveFilters);

  const { data: filteredData, isLoading: isLoadingFiltered } =
    useFilteredMovies(
      {
        query: debouncedQuery.trim() || undefined,
        genreId,
        year: year !== "all" ? year : undefined,
        minRating: minRating > 0 ? minRating : undefined,
      },
      hasActiveFilters,
    );

  const sentinelRef = useRef<HTMLDivElement>(null);
  useIntersectionObserver(
    sentinelRef,
    () => {
      if (!hasActiveFilters && hasNextPage && !isFetchingNextPage)
        fetchNextPage();
    },
    SENTINEL_OPTIONS,
  );

  const popularMovies = data?.pages.flatMap((p) => p.movies) ?? [];
  const filteredMovies = filteredData?.movies ?? [];

  const movies = hasActiveFilters ? filteredMovies : popularMovies;
  const isLoading = hasActiveFilters ? isLoadingFiltered : isLoadingPopular;
  const totalResults = filteredData?.totalResults;

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">
          Curadoria
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Descoberta</h1>
        <p className="text-sm text-muted-foreground">
          Explore o catálogo, refine por gênero, ano e nota mínima, e construa
          sua estante.
        </p>
      </div>

      <div className="mb-6 grid gap-4 rounded-xl border border-border/60 bg-card/40 p-4 lg:grid-cols-[1fr_auto_auto_minmax(220px,1fr)_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por título…"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <Select value={genre} onValueChange={setGenre}>
          <SelectTrigger className="min-w-[140px]">
            <SelectValue placeholder="Gênero" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os gêneros</SelectItem>
            {TMDB_GENRES.map((g) => (
              <SelectItem key={g.id} value={g.name}>
                {g.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="min-w-[120px]">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os anos</SelectItem>
            {YEARS.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-3 px-2">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>Nota mínima</span>
              <span className="font-mono text-primary">
                {minRating.toFixed(1)}
              </span>
            </div>
            <Slider
              value={[minRating]}
              max={10}
              step={0.1}
              onValueChange={(v) => setMinRating(v[0])}
            />
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          disabled={activeFiltersCount === 0 && !query}
        >
          <X className="h-4 w-4" />
          Limpar
        </Button>
      </div>

      {hasActiveFilters && !isLoading && (
        <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Mostrando <span className="text-foreground">{movies.length}</span>
            {totalResults !== undefined && (
              <>
                {" "}
                de <span className="text-foreground">{totalResults}</span>
              </>
            )}{" "}
            filmes
          </span>
          {activeFiltersCount > 0 && (
            <span className="text-primary">
              {activeFiltersCount} filtro(s) ativo(s)
            </span>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-20 text-center">
          <p className="text-lg font-medium">Nenhum filme encontrado</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Ajuste os filtros ou limpe a busca.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((m) => (
            <MovieCard
              key={m.id}
              movie={m}
              inList={watchlistMovies.some((wm) => wm.id === m.id)}
              onToggle={toggleWatchlist}
            />
          ))}
        </div>
      )}

      {!hasActiveFilters && (
        <>
          <div ref={sentinelRef} className="h-4 mt-4" />
          {isFetchingNextPage && (
            <div className="flex justify-center pb-8">
              <Loader className="h-6 w-6" />
            </div>
          )}
          {hasNextPage && !isFetchingNextPage && (
            <div className="flex justify-center py-6">
              <Button variant="outline" onClick={() => fetchNextPage()}>
                Carregar mais
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default Dashboard;
