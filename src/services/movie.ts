import { apiRequest } from "./index";
import type {
  ITMDBResponse,
  IFetchMoviesParams,
  ITMDBRequestParams,
} from "@/types";
import { mapTMDBToMovie } from "@/constants";

export const moviePopular = async (page = 1) => {
  const params: ITMDBRequestParams = { language: "pt-BR", page };

  const data = await apiRequest<ITMDBResponse>(
    "GET",
    "/movie/popular",
    undefined,
    { params },
  );

  return {
    movies: data.results.map(mapTMDBToMovie),
    page,
    totalPages: data.total_pages,
  };
};

export const fetchMoviesFromAPI = async (params: IFetchMoviesParams) => {
  const { query, genreId, year, minRating, page = 1 } = params;

  const isSearch = Boolean(query?.trim());
  const isDiscover = Boolean(
    genreId || (year && year !== "all") || (minRating && minRating > 0),
  );

  const url = isSearch
    ? "/search/movie"
    : isDiscover
      ? "/discover/movie"
      : "/movie/popular";

  const discoverParams = isDiscover
    ? {
        sort_by: "popularity.desc",
        ...(genreId && { with_genres: genreId }),
        ...(year && year !== "all" && { primary_release_year: year }),
        ...(minRating && minRating > 0 && { "vote_average.gte": minRating }),
      }
    : {};

  const apiParams: ITMDBRequestParams = {
    language: "pt-BR",
    page,
    ...(isSearch && { query }),
    ...discoverParams,
  };

  const data = await apiRequest<ITMDBResponse>("GET", url, undefined, {
    params: apiParams,
  });

  return {
    movies: data.results.map(mapTMDBToMovie),
    totalResults: data.total_results,
  };
};
