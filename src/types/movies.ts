export interface Movie {
  id: number;
  title: string;
  poster: string;
  rating: number;
  genre: string;
  year: number;
}

export interface MovieDetail extends Movie {
  backdrop: string | null;
  overview: string;
  runtime: number;
  director: string;
  cast: string[];
  trailer: string | null;
}

export interface ITMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  genre_ids?: number[];
  release_date: string;
}

export interface ITMDBMovieDetail {
  id: number;
  title: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  overview: string;
  credits: {
    cast: Array<{ name: string; order: number }>;
    crew: Array<{ job: string; name: string }>;
  };
  videos: {
    results: Array<{
      type: string;
      site: string;
      key: string;
      official: boolean;
    }>;
  };
}

export interface ITMDBResponse {
  page: number;
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
  page?: number;
  query?: string;
  sort_by?: string;
  with_genres?: number;
  primary_release_year?: string;
  "vote_average.gte"?: number;
  append_to_response?: string;
}
