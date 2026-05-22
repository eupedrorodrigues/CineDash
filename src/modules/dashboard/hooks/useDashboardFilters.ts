import { useState } from "react";
import { useDebounce } from "@/hooks";
import { TMDB_GENRES } from "@/constants";

export function useDashboardFilters() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("all");
  const [year, setYear] = useState("all");
  const [minRating, setMinRating] = useState(0);

  const debouncedQuery = useDebounce(query, 350);

  const hasActiveFilters =
    Boolean(debouncedQuery.trim()) ||
    genre !== "all" ||
    year !== "all" ||
    minRating > 0;

  const genreId =
    genre !== "all" ? TMDB_GENRES.find((g) => g.name === genre)?.id : undefined;

  const activeFiltersCount =
    (genre !== "all" ? 1 : 0) +
    (year !== "all" ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  const clearFilters = () => {
    setQuery("");
    setGenre("all");
    setYear("all");
    setMinRating(0);
  };

  return {
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
  };
}
