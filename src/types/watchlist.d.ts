import type { Movie } from "./movies";

export type SortKey = "title" | "genre" | "rating";
export type SortDir = "asc" | "desc";

export interface SortableHeaderProps {
  label: string;
  col: SortKey;
  active: SortKey;
  dir: SortDir;
  onSort: (col: SortKey) => void;
}

export interface WatchlistState {
  movies: Movie[];
  toggle: (movie: Movie) => void;
  has: (id: number) => boolean;
  clear: () => void;
}
