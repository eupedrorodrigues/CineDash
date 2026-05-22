import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useInfiniteMovies } from "@/modules/dashboard/hooks/useInfiniteMovies";

vi.mock("@/services/movie", () => ({ fetchPopularMovies: vi.fn() }));

import { fetchPopularMovies } from "@/services/movie";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useInfiniteMovies", () => {
  describe("getNextPageParam", () => {
    it("hasNextPage é true quando há mais páginas", async () => {
      vi.mocked(fetchPopularMovies).mockResolvedValue({
        movies: [],
        page: 1,
        totalPages: 3,
      });

      const { result } = renderHook(() => useInfiniteMovies(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.hasNextPage).toBe(true));
    });

    it("hasNextPage é false quando está na última página", async () => {
      vi.mocked(fetchPopularMovies).mockResolvedValue({
        movies: [],
        page: 3,
        totalPages: 3,
      });

      const { result } = renderHook(() => useInfiniteMovies(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.hasNextPage).toBe(false));
    });

    it("hasNextPage é false quando total é 1 página", async () => {
      vi.mocked(fetchPopularMovies).mockResolvedValue({
        movies: [],
        page: 1,
        totalPages: 1,
      });

      const { result } = renderHook(() => useInfiniteMovies(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.hasNextPage).toBe(false));
    });
  });

  describe("enabled", () => {
    it("não inicia a query quando enabled é false", () => {
      const { result } = renderHook(() => useInfiniteMovies(false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe("idle");
      expect(fetchPopularMovies).not.toHaveBeenCalled();
    });
  });
});
