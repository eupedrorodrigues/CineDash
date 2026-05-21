import type { Movie } from "./movies";

export interface WatchlistState {
  movies: Movie[];
  toggle: (movie: Movie) => void;
  has: (id: number) => boolean;
  clear: () => void;
}
