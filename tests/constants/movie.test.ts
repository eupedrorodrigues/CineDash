import { describe, it, expect } from "vitest";
import { mapTMDBToMovie, mapTMDBToMovieDetail } from "@/constants/movie";
import type { ITMDBMovie, ITMDBMovieDetail } from "@/types";

const BASE_IMAGE = "https://image.tmdb.org/t/p/w500";
const BASE_BACKDROP = "https://image.tmdb.org/t/p/original";
const BASE_YOUTUBE = "https://www.youtube.com/embed";
const FALLBACK_POSTER = "https://fallback.com/poster.jpg";

const makeTMDBMovie = (overrides: Partial<ITMDBMovie> = {}): ITMDBMovie => ({
  id: 1,
  title: "Filme Teste",
  poster_path: "/poster.jpg",
  vote_average: 8.5,
  genre_ids: [28, 18],
  release_date: "2023-07-15",
  ...overrides,
});

const makeTMDBDetail = (overrides: Partial<ITMDBMovieDetail> = {}): ITMDBMovieDetail => ({
  id: 1,
  title: "Filme Teste",
  poster_path: "/poster.jpg",
  backdrop_path: "/backdrop.jpg",
  vote_average: 8.5,
  release_date: "2023-07-15",
  runtime: 148,
  genres: [{ id: 28, name: "Ação" }, { id: 18, name: "Drama" }],
  overview: "Um filme incrível.",
  credits: {
    cast: Array.from({ length: 10 }, (_, i) => ({ name: `Ator ${i + 1}`, order: i })),
    crew: [
      { job: "Director", name: "Christopher Nolan" },
      { job: "Producer", name: "Emma Thomas" },
    ],
  },
  videos: {
    results: [
      { type: "Trailer", site: "YouTube", key: "abc123", official: true },
    ],
  },
  ...overrides,
});

describe("mapTMDBToMovie", () => {
  it("mapeia id e title corretamente", () => {
    const movie = mapTMDBToMovie(makeTMDBMovie());
    expect(movie.id).toBe(1);
    expect(movie.title).toBe("Filme Teste");
  });

  it("constrói URL do poster com o base URL", () => {
    const movie = mapTMDBToMovie(makeTMDBMovie({ poster_path: "/poster.jpg" }));
    expect(movie.poster).toBe(`${BASE_IMAGE}/poster.jpg`);
  });

  it("usa poster de fallback quando poster_path é null", () => {
    const movie = mapTMDBToMovie(makeTMDBMovie({ poster_path: null }));
    expect(movie.poster).toBe(FALLBACK_POSTER);
  });

  it("mapeia vote_average para rating", () => {
    const movie = mapTMDBToMovie(makeTMDBMovie({ vote_average: 7.3 }));
    expect(movie.rating).toBe(7.3);
  });

  it("resolve genre_ids para nomes em português", () => {
    const movie = mapTMDBToMovie(makeTMDBMovie({ genre_ids: [28, 18] }));
    expect(movie.genre).toBe("Ação, Drama");
  });

  it("limita a 2 gêneros mesmo com mais IDs", () => {
    const movie = mapTMDBToMovie(makeTMDBMovie({ genre_ids: [28, 18, 35, 80] }));
    expect(movie.genre.split(", ")).toHaveLength(2);
  });

  it("retorna 'Outro' quando genre_ids está vazio", () => {
    const movie = mapTMDBToMovie(makeTMDBMovie({ genre_ids: [] }));
    expect(movie.genre).toBe("Outro");
  });

  it("extrai o ano de release_date no formato YYYY-MM-DD", () => {
    const movie = mapTMDBToMovie(makeTMDBMovie({ release_date: "2023-07-15" }));
    expect(movie.year).toBe(2023);
  });

  it("retorna ano 0 para release_date vazio", () => {
    const movie = mapTMDBToMovie(makeTMDBMovie({ release_date: "" }));
    expect(movie.year).toBe(0);
  });
});

describe("mapTMDBToMovieDetail", () => {
  it("constrói URL do backdrop com o base URL", () => {
    const movie = mapTMDBToMovieDetail(makeTMDBDetail({ backdrop_path: "/backdrop.jpg" }));
    expect(movie.backdrop).toBe(`${BASE_BACKDROP}/backdrop.jpg`);
  });

  it("retorna null para backdrop quando backdrop_path é null", () => {
    const movie = mapTMDBToMovieDetail(makeTMDBDetail({ backdrop_path: null }));
    expect(movie.backdrop).toBeNull();
  });

  it("extrai o diretor da crew pelo job 'Director'", () => {
    const movie = mapTMDBToMovieDetail(makeTMDBDetail());
    expect(movie.director).toBe("Christopher Nolan");
  });

  it("retorna 'Desconhecido' quando não há diretor na crew", () => {
    const movie = mapTMDBToMovieDetail(
      makeTMDBDetail({ credits: { cast: [], crew: [{ job: "Producer", name: "Alguém" }] } }),
    );
    expect(movie.director).toBe("Desconhecido");
  });

  it("limita o cast a 6 atores", () => {
    const movie = mapTMDBToMovieDetail(makeTMDBDetail());
    expect(movie.cast).toHaveLength(6);
  });

  it("constrói URL do trailer oficial do YouTube", () => {
    const movie = mapTMDBToMovieDetail(makeTMDBDetail());
    expect(movie.trailer).toBe(`${BASE_YOUTUBE}/abc123`);
  });

  it("usa trailer não-oficial como fallback quando não há oficial", () => {
    const detail = makeTMDBDetail({
      videos: {
        results: [{ type: "Trailer", site: "YouTube", key: "xyz789", official: false }],
      },
    });
    const movie = mapTMDBToMovieDetail(detail);
    expect(movie.trailer).toBe(`${BASE_YOUTUBE}/xyz789`);
  });

  it("prefere trailer oficial em relação ao não-oficial", () => {
    const detail = makeTMDBDetail({
      videos: {
        results: [
          { type: "Trailer", site: "YouTube", key: "nao-oficial", official: false },
          { type: "Trailer", site: "YouTube", key: "oficial", official: true },
        ],
      },
    });
    const movie = mapTMDBToMovieDetail(detail);
    expect(movie.trailer).toBe(`${BASE_YOUTUBE}/oficial`);
  });

  it("retorna null para trailer quando não há vídeos", () => {
    const movie = mapTMDBToMovieDetail(makeTMDBDetail({ videos: { results: [] } }));
    expect(movie.trailer).toBeNull();
  });

  it("mapeia overview e runtime corretamente", () => {
    const movie = mapTMDBToMovieDetail(makeTMDBDetail());
    expect(movie.overview).toBe("Um filme incrível.");
    expect(movie.runtime).toBe(148);
  });
});
