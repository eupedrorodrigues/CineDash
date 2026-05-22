import { useQuery } from "@tanstack/react-query";
import { fetchMoviesFromAPI } from "@/services/movie";
import type { IFetchMoviesParams } from "@/types";

export const useFilteredMovies = (params: IFetchMoviesParams, enabled: boolean) =>
  useQuery({
    queryKey: ["movies", "filtered", params],
    queryFn: () => fetchMoviesFromAPI(params),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
