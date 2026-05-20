export interface Movie {
  id: number;
  title: string;
  poster: string;
  rating: number;
  genre: string;
  year: number;
}

export interface ITMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  genre_ids: number[];
  release_date: string;
}

export interface ITMDBResponse {
  results: ITMDBMovie[];
  total_results: number;
  total_pages: number;
}

export interface IFetchMoviesParams {
  query?: string;
  genreId?: number;
  year?: string;
  minRating?: number;
  page?: number;
}

export interface ITMDBRequestParams {
  language: string;
  page: number;
  query?: string;
  sort_by?: string;
  with_genres?: number;
  primary_release_year?: string;
  "vote_average.gte"?: number;
}
