import { apiRequest } from "./index";
import type {
  ITMDBResponse,
  ITMDBMovieDetail,
  IFetchMoviesParams,
  ITMDBRequestParams,
} from "@/types";
import {
  mapTMDBToMovie,
  mapTMDBToMovieDetail,
  TMDB_LANGUAGE,
} from "@/constants";

export const fetchPopularMovies = async (page = 1) => {
  const params: ITMDBRequestParams = { language: TMDB_LANGUAGE, page };

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

export const fetchMovieDetail = async (id: number) => {
  const data = await apiRequest<ITMDBMovieDetail>("GET", `/movie/${id}`, undefined, {
    params: {
      language: TMDB_LANGUAGE,
      append_to_response: "credits,videos",
    },
  });
  return mapTMDBToMovieDetail(data);
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
    language: TMDB_LANGUAGE,
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
