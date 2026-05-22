import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchMoviesFromAPI,
  fetchPopularMovies,
  fetchMovieDetail,
} from "@/services/movie";

vi.mock("@/services/index", () => ({ apiRequest: vi.fn() }));

import { apiRequest } from "@/services/index";

const mockListResponse = {
  results: [],
  total_results: 0,
  total_pages: 1,
  page: 1,
};

const mockDetailResponse = {
  id: 550,
  title: "Fight Club",
  poster_path: null,
  backdrop_path: null,
  vote_average: 8.8,
  release_date: "1999-10-15",
  runtime: 139,
  genres: [],
  overview: "Um homem insatisfeito.",
  credits: { cast: [], crew: [] },
  videos: { results: [] },
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(apiRequest).mockResolvedValue(mockListResponse);
});

describe("fetchMoviesFromAPI", () => {
  describe("roteamento de URL", () => {
    it("usa /search/movie quando query está preenchida", async () => {
      await fetchMoviesFromAPI({ query: "Matrix" });
      expect(vi.mocked(apiRequest).mock.calls[0][1]).toBe("/search/movie");
    });

    it("usa /discover/movie quando genreId está definido", async () => {
      await fetchMoviesFromAPI({ genreId: 28 });
      expect(vi.mocked(apiRequest).mock.calls[0][1]).toBe("/discover/movie");
    });

    it("usa /discover/movie quando year está definido (não 'all')", async () => {
      await fetchMoviesFromAPI({ year: "2023" });
      expect(vi.mocked(apiRequest).mock.calls[0][1]).toBe("/discover/movie");
    });

    it("usa /discover/movie quando minRating > 0", async () => {
      await fetchMoviesFromAPI({ minRating: 7 });
      expect(vi.mocked(apiRequest).mock.calls[0][1]).toBe("/discover/movie");
    });

    it("usa /movie/popular quando não há nenhum filtro", async () => {
      await fetchMoviesFromAPI({});
      expect(vi.mocked(apiRequest).mock.calls[0][1]).toBe("/movie/popular");
    });

    it("usa /movie/popular quando minRating é 0 e year é 'all'", async () => {
      await fetchMoviesFromAPI({ minRating: 0, year: "all" });
      expect(vi.mocked(apiRequest).mock.calls[0][1]).toBe("/movie/popular");
    });

    it("query tem prioridade sobre genreId e redireciona para /search/movie", async () => {
      await fetchMoviesFromAPI({ query: "Matrix", genreId: 28 });
      expect(vi.mocked(apiRequest).mock.calls[0][1]).toBe("/search/movie");
    });
  });

  describe("construção dos parâmetros de /discover", () => {
    it("inclui with_genres quando genreId está definido", async () => {
      await fetchMoviesFromAPI({ genreId: 28 });
      const params = vi.mocked(apiRequest).mock.calls[0][3]?.params as Record<string, unknown>;
      expect(params).toHaveProperty("with_genres", 28);
    });

    it("inclui primary_release_year quando year não é 'all'", async () => {
      await fetchMoviesFromAPI({ year: "2023" });
      const params = vi.mocked(apiRequest).mock.calls[0][3]?.params as Record<string, unknown>;
      expect(params).toHaveProperty("primary_release_year", "2023");
    });

    it("inclui vote_average.gte quando minRating > 0", async () => {
      await fetchMoviesFromAPI({ minRating: 7 });
      const params = vi.mocked(apiRequest).mock.calls[0][3]?.params as Record<string, unknown>;
      expect(params).toHaveProperty("vote_average.gte", 7);
    });

    it("NÃO inclui vote_average.gte quando minRating é 0", async () => {
      await fetchMoviesFromAPI({ genreId: 28, minRating: 0 });
      const params = vi.mocked(apiRequest).mock.calls[0][3]?.params as Record<string, unknown>;
      expect(params).not.toHaveProperty("vote_average.gte");
    });

    it("NÃO inclui primary_release_year quando year é 'all'", async () => {
      await fetchMoviesFromAPI({ genreId: 28, year: "all" });
      const params = vi.mocked(apiRequest).mock.calls[0][3]?.params as Record<string, unknown>;
      expect(params).not.toHaveProperty("primary_release_year");
    });
  });
});

describe("fetchPopularMovies", () => {
  it("usa página 1 por padrão", async () => {
    await fetchPopularMovies();
    const params = vi.mocked(apiRequest).mock.calls[0][3]?.params as Record<string, unknown>;
    expect(params).toHaveProperty("page", 1);
  });

  it("passa o número de página fornecido para a API", async () => {
    await fetchPopularMovies(3);
    const params = vi.mocked(apiRequest).mock.calls[0][3]?.params as Record<string, unknown>;
    expect(params).toHaveProperty("page", 3);
  });

  it("retorna page e totalPages mapeados da resposta da API", async () => {
    vi.mocked(apiRequest).mockResolvedValueOnce({
      results: [],
      page: 2,
      total_pages: 10,
      total_results: 200,
    });
    const result = await fetchPopularMovies(2);
    expect(result.page).toBe(2);
    expect(result.totalPages).toBe(10);
  });
});

describe("fetchMovieDetail", () => {
  beforeEach(() => {
    vi.mocked(apiRequest).mockResolvedValue(mockDetailResponse);
  });

  it("usa a URL com o id do filme", async () => {
    await fetchMovieDetail(550);
    expect(vi.mocked(apiRequest).mock.calls[0][1]).toBe("/movie/550");
  });

  it("inclui credits e videos em append_to_response", async () => {
    await fetchMovieDetail(550);
    const params = vi.mocked(apiRequest).mock.calls[0][3]?.params as Record<string, unknown>;
    expect(params?.append_to_response).toBe("credits,videos");
  });
});
