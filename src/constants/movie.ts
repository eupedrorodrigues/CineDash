import type { ITMDBMovie, ITMDBMovieDetail, Movie, MovieDetail } from "@/types";

export const TMDB_REVERSE_GENRE_MAP: Record<number, string> = {
  28: "Ação",
  12: "Aventura",
  16: "Animação",
  35: "Comédia",
  80: "Crime",
  99: "Documentário",
  18: "Drama",
  10751: "Família",
  14: "Fantasia",
  36: "História",
  27: "Terror",
  9648: "Mistério",
  10749: "Romance",
  878: "Ficção Científica",
  53: "Thriller",
  10752: "Guerra",
  37: "Faroeste",
};

export const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
export const TMDB_BACKDROP_BASE_URL = import.meta.env
  .VITE_TMDB_BACKDROP_BASE_URL;
export const YOUTUBE_EMBED_BASE_URL = import.meta.env
  .VITE_YOUTUBE_EMBED_BASE_URL;
export const POSTER_FALLBACK_URL = import.meta.env.VITE_POSTER_FALLBACK_URL;
export const TMDB_LANGUAGE = "pt-BR";

export const TMDB_GENRES = Object.entries(TMDB_REVERSE_GENRE_MAP)
  .map(([id, name]) => ({ id: Number(id), name }))
  .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

const parseYear = (releaseDate: string): number =>
  releaseDate ? Number(releaseDate.split("-")[0]) || 0 : 0;

export const mapTMDBToMovie = (m: ITMDBMovie): Movie => {
  const genres = (m.genre_ids ?? [])
    .map((id) => TMDB_REVERSE_GENRE_MAP[id])
    .filter(Boolean);

  return {
    id: m.id,
    title: m.title,
    poster: m.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${m.poster_path}`
      : POSTER_FALLBACK_URL,
    rating: m.vote_average ?? 0,
    genre: genres.slice(0, 2).join(", ") || "Outro",
    year: parseYear(m.release_date),
  };
};

export const mapTMDBToMovieDetail = (m: ITMDBMovieDetail): MovieDetail => {
  const director =
    m.credits.crew.find((c) => c.job === "Director")?.name ?? "Desconhecido";
  const cast = m.credits.cast.slice(0, 6).map((c) => c.name);
  const trailer =
    m.videos.results.find(
      (v) => v.type === "Trailer" && v.site === "YouTube" && v.official,
    ) ??
    m.videos.results.find((v) => v.type === "Trailer" && v.site === "YouTube");

  return {
    id: m.id,
    title: m.title,
    poster: m.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${m.poster_path}`
      : POSTER_FALLBACK_URL,
    backdrop: m.backdrop_path
      ? `${TMDB_BACKDROP_BASE_URL}${m.backdrop_path}`
      : null,
    rating: m.vote_average ?? 0,
    genre:
      m.genres
        .slice(0, 2)
        .map((g) => g.name)
        .join(", ") || "Outro",
    year: parseYear(m.release_date),
    overview: m.overview,
    runtime: m.runtime,
    director,
    cast,
    trailer: trailer ? `${YOUTUBE_EMBED_BASE_URL}/${trailer.key}` : null,
  };
};
