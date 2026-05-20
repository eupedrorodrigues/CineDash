import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Movie } from "@/types";

interface WatchlistState {
  movies: Movie[];
  toggle: (movie: Movie) => void;
  has: (id: number) => boolean;
  clear: () => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      movies: [],
      toggle: (movie) =>
        set((s) => ({
          movies: s.movies.some((m) => m.id === movie.id)
            ? s.movies.filter((m) => m.id !== movie.id)
            : [...s.movies, movie],
        })),
      has: (id) => get().movies.some((m) => m.id === id),
      clear: () => set({ movies: [] }),
    }),
    {
      name: "cinedash-watchlist",
    },
  ),
);
