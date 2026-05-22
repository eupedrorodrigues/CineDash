import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";

afterEach(() => {
  vi.useRealTimers();
});

describe("useDebounce", () => {
  it("retorna o valor inicial imediatamente sem esperar o delay", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useDebounce("inicial", 300));
    expect(result.current).toBe("inicial");
  });

  it("não atualiza o valor antes do delay expirar", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "b" });
    act(() => vi.advanceTimersByTime(299));

    expect(result.current).toBe("a");
  });

  it("atualiza o valor após o delay expirar", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "b" });
    act(() => vi.advanceTimersByTime(300));

    expect(result.current).toBe("b");
  });

  it("cancela o timer anterior em mudanças rápidas (debounce real)", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "b" });
    act(() => vi.advanceTimersByTime(200));

    rerender({ value: "c" });
    act(() => vi.advanceTimersByTime(300));

    expect(result.current).toBe("c");
  });

  it("funciona com valores numéricos", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 0 } },
    );

    rerender({ value: 42 });
    act(() => vi.runAllTimers());

    expect(result.current).toBe(42);
  });
});
