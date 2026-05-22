import { describe, it, expect, beforeEach } from "vitest";
import { useWatchlistStore } from "@/modules/watchlist/store/watchlistStore";
import type { Movie } from "@/types";

const movieA: Movie = { id: 1, title: "Filme A", poster: "", rating: 8.5, genre: "Ação", year: 2023 };
const movieB: Movie = { id: 2, title: "Filme B", poster: "", rating: 7.0, genre: "Drama", year: 2022 };

beforeEach(() => {
  useWatchlistStore.setState({ movies: [] });
});

describe("watchlistStore", () => {
  describe("estado inicial", () => {
    it("inicia com lista vazia", () => {
      expect(useWatchlistStore.getState().movies).toEqual([]);
    });
  });

  describe("toggle", () => {
    it("adiciona filme quando não está na lista", () => {
      useWatchlistStore.getState().toggle(movieA);
      expect(useWatchlistStore.getState().movies).toHaveLength(1);
      expect(useWatchlistStore.getState().movies[0].id).toBe(movieA.id);
    });

    it("remove filme quando já está na lista", () => {
      useWatchlistStore.getState().toggle(movieA);
      useWatchlistStore.getState().toggle(movieA);
      expect(useWatchlistStore.getState().movies).toHaveLength(0);
    });

    it("mantém outros filmes ao remover um", () => {
      useWatchlistStore.getState().toggle(movieA);
      useWatchlistStore.getState().toggle(movieB);
      useWatchlistStore.getState().toggle(movieA);

      const movies = useWatchlistStore.getState().movies;
      expect(movies).toHaveLength(1);
      expect(movies[0].id).toBe(movieB.id);
    });

    it("permite adicionar múltiplos filmes distintos", () => {
      useWatchlistStore.getState().toggle(movieA);
      useWatchlistStore.getState().toggle(movieB);
      expect(useWatchlistStore.getState().movies).toHaveLength(2);
    });

    it("preserva todos os campos do objeto Movie ao adicionar", () => {
      useWatchlistStore.getState().toggle(movieA);
      const stored = useWatchlistStore.getState().movies[0];
      expect(stored).toEqual(movieA);
    });
  });

  describe("has", () => {
    it("retorna false para filme não adicionado", () => {
      expect(useWatchlistStore.getState().has(movieA.id)).toBe(false);
    });

    it("retorna true para filme adicionado", () => {
      useWatchlistStore.getState().toggle(movieA);
      expect(useWatchlistStore.getState().has(movieA.id)).toBe(true);
    });

    it("retorna false após remover o filme", () => {
      useWatchlistStore.getState().toggle(movieA);
      useWatchlistStore.getState().toggle(movieA);
      expect(useWatchlistStore.getState().has(movieA.id)).toBe(false);
    });
  });

  describe("clear", () => {
    it("esvazia a lista completamente", () => {
      useWatchlistStore.getState().toggle(movieA);
      useWatchlistStore.getState().toggle(movieB);
      useWatchlistStore.getState().clear();
      expect(useWatchlistStore.getState().movies).toHaveLength(0);
    });

    it("não falha ao limpar lista já vazia", () => {
      expect(() => useWatchlistStore.getState().clear()).not.toThrow();
    });
  });
});
