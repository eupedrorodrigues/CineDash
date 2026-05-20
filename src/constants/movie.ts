import type { ITMDBMovie, Movie } from "@/types";

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
export const POSTER_FALLBACK_URL = import.meta.env.VITE_POSTER_FALLBACK_URL;

export const mapTMDBToMovie = (m: ITMDBMovie): Movie => {
  const genres = (m.genre_ids || [])
    .map((id) => TMDB_REVERSE_GENRE_MAP[id])
    .filter(Boolean);

  const year = m.release_date ? Number(m.release_date.split("-")[0]) || 0 : 0;

  return {
    id: m.id,
    title: m.title,
    poster: m.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${m.poster_path}`
      : POSTER_FALLBACK_URL,
    rating: m.vote_average || 0,
    genre: genres.slice(0, 2).join(", ") || "Outro",
    year,
  };
};
