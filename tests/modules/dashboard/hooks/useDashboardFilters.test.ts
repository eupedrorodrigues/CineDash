import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDashboardFilters } from "@/modules/dashboard/hooks/useDashboardFilters";

afterEach(() => {
  vi.useRealTimers();
});

describe("useDashboardFilters", () => {
  describe("estado inicial", () => {
    it("inicia com query vazia", () => {
      const { result } = renderHook(() => useDashboardFilters());
      expect(result.current.query).toBe("");
    });

    it("inicia com genre 'all'", () => {
      const { result } = renderHook(() => useDashboardFilters());
      expect(result.current.genre).toBe("all");
    });

    it("inicia com year 'all'", () => {
      const { result } = renderHook(() => useDashboardFilters());
      expect(result.current.year).toBe("all");
    });

    it("inicia com minRating 0", () => {
      const { result } = renderHook(() => useDashboardFilters());
      expect(result.current.minRating).toBe(0);
    });

    it("hasActiveFilters é false no estado inicial", () => {
      const { result } = renderHook(() => useDashboardFilters());
      expect(result.current.hasActiveFilters).toBe(false);
    });

    it("activeFiltersCount é 0 no estado inicial", () => {
      const { result } = renderHook(() => useDashboardFilters());
      expect(result.current.activeFiltersCount).toBe(0);
    });

    it("genreId é undefined no estado inicial", () => {
      const { result } = renderHook(() => useDashboardFilters());
      expect(result.current.genreId).toBeUndefined();
    });
  });

  describe("hasActiveFilters", () => {
    it("fica true ao mudar genre", () => {
      const { result } = renderHook(() => useDashboardFilters());
      act(() => result.current.setGenre("Ação"));
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it("fica true ao mudar year", () => {
      const { result } = renderHook(() => useDashboardFilters());
      act(() => result.current.setYear("2023"));
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it("fica true ao definir minRating acima de 0", () => {
      const { result } = renderHook(() => useDashboardFilters());
      act(() => result.current.setMinRating(7));
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it("fica true após debounce com query preenchida", () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useDashboardFilters());

      act(() => result.current.setQuery("Interestelar"));
      act(() => vi.runAllTimers());

      expect(result.current.hasActiveFilters).toBe(true);
    });

    it("permanece false enquanto o debounce não disparou", () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useDashboardFilters());

      act(() => result.current.setQuery("Interestelar"));

      expect(result.current.hasActiveFilters).toBe(false);
    });
  });

  describe("activeFiltersCount", () => {
    it("conta genre ativo", () => {
      const { result } = renderHook(() => useDashboardFilters());
      act(() => result.current.setGenre("Drama"));
      expect(result.current.activeFiltersCount).toBe(1);
    });

    it("conta year ativo", () => {
      const { result } = renderHook(() => useDashboardFilters());
      act(() => result.current.setYear("2022"));
      expect(result.current.activeFiltersCount).toBe(1);
    });

    it("conta minRating ativo", () => {
      const { result } = renderHook(() => useDashboardFilters());
      act(() => result.current.setMinRating(8));
      expect(result.current.activeFiltersCount).toBe(1);
    });

    it("acumula múltiplos filtros ativos", () => {
      const { result } = renderHook(() => useDashboardFilters());
      act(() => {
        result.current.setGenre("Ação");
        result.current.setYear("2021");
        result.current.setMinRating(6);
      });
      expect(result.current.activeFiltersCount).toBe(3);
    });
  });

  describe("genreId", () => {
    it("resolve o id correto para gênero existente", () => {
      const { result } = renderHook(() => useDashboardFilters());
      act(() => result.current.setGenre("Ação"));
      expect(result.current.genreId).toBe(28);
    });

    it("retorna undefined ao voltar para 'all'", () => {
      const { result } = renderHook(() => useDashboardFilters());
      act(() => result.current.setGenre("Ação"));
      act(() => result.current.setGenre("all"));
      expect(result.current.genreId).toBeUndefined();
    });
  });

  describe("debouncedQuery", () => {
    it("reflete o valor de query após o debounce disparar", () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useDashboardFilters());

      act(() => result.current.setQuery("Inception"));
      act(() => vi.runAllTimers());

      expect(result.current.debouncedQuery).toBe("Inception");
    });

    it("é resetado para string vazia após clearFilters + debounce", () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useDashboardFilters());

      act(() => result.current.setQuery("Inception"));
      act(() => vi.runAllTimers());
      act(() => result.current.clearFilters());
      act(() => vi.runAllTimers());

      expect(result.current.debouncedQuery).toBe("");
    });
  });

  describe("activeFiltersCount não conta query", () => {
    it("query preenchida não incrementa activeFiltersCount", () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useDashboardFilters());

      act(() => result.current.setQuery("Inception"));
      act(() => vi.runAllTimers());

      expect(result.current.hasActiveFilters).toBe(true);
      expect(result.current.activeFiltersCount).toBe(0);
    });
  });

  describe("clearFilters", () => {
    it("reseta todos os filtros para o estado inicial", () => {
      const { result } = renderHook(() => useDashboardFilters());

      act(() => {
        result.current.setQuery("Matrix");
        result.current.setGenre("Ação");
        result.current.setYear("1999");
        result.current.setMinRating(9);
      });

      act(() => result.current.clearFilters());

      expect(result.current.query).toBe("");
      expect(result.current.genre).toBe("all");
      expect(result.current.year).toBe("all");
      expect(result.current.minRating).toBe(0);
      expect(result.current.activeFiltersCount).toBe(0);
    });

    it("hasActiveFilters fica false após clearFilters", () => {
      const { result } = renderHook(() => useDashboardFilters());

      act(() => result.current.setGenre("Terror"));
      act(() => result.current.clearFilters());

      expect(result.current.hasActiveFilters).toBe(false);
    });
  });
});
