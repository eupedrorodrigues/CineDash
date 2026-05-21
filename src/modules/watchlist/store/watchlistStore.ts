import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WatchlistState } from "@/types";

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
