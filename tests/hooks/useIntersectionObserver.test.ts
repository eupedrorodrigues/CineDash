import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRef } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

type IntersectCallback = (entries: Pick<IntersectionObserverEntry, "isIntersecting">[]) => void;

const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
let triggerIntersect: IntersectCallback;

beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    vi.fn().mockImplementation(function (cb: IntersectCallback) {
      triggerIntersect = cb;
      return { observe: mockObserve, disconnect: mockDisconnect };
    }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("useIntersectionObserver", () => {
  it("não cria observer quando ref.current é null", () => {
    const ref = { current: null };
    renderHook(() => useIntersectionObserver(ref, vi.fn()));
    expect(mockObserve).not.toHaveBeenCalled();
  });

  it("chama observe no elemento quando ref.current existe", () => {
    const element = document.createElement("div");
    renderHook(() => {
      const ref = useRef(element);
      useIntersectionObserver(ref, vi.fn());
    });
    expect(mockObserve).toHaveBeenCalledWith(element);
  });

  it("dispara a callback quando isIntersecting é true", () => {
    const onIntersect = vi.fn();
    const element = document.createElement("div");
    renderHook(() => {
      const ref = useRef(element);
      useIntersectionObserver(ref, onIntersect);
    });
    triggerIntersect([{ isIntersecting: true }]);
    expect(onIntersect).toHaveBeenCalledOnce();
  });

  it("não dispara a callback quando isIntersecting é false", () => {
    const onIntersect = vi.fn();
    const element = document.createElement("div");
    renderHook(() => {
      const ref = useRef(element);
      useIntersectionObserver(ref, onIntersect);
    });
    triggerIntersect([{ isIntersecting: false }]);
    expect(onIntersect).not.toHaveBeenCalled();
  });

  it("chama disconnect ao desmontar o componente", () => {
    const element = document.createElement("div");
    const { unmount } = renderHook(() => {
      const ref = useRef(element);
      useIntersectionObserver(ref, vi.fn());
    });
    mockDisconnect.mockClear();
    unmount();
    expect(mockDisconnect).toHaveBeenCalledOnce();
  });

  it("passa as options para o construtor do IntersectionObserver", () => {
    const element = document.createElement("div");
    const options: IntersectionObserverInit = { rootMargin: "200px", threshold: 0.5 };

    renderHook(() => {
      const ref = useRef(element);
      useIntersectionObserver(ref, vi.fn(), options);
    });

    expect(IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      options,
    );
  });

  it("usa sempre a versão mais recente da callback (callbackRef)", () => {
    const element = document.createElement("div");
    const firstCallback = vi.fn();
    const secondCallback = vi.fn();

    const { rerender } = renderHook(
      ({ cb }) => {
        const ref = useRef(element);
        useIntersectionObserver(ref, cb);
      },
      { initialProps: { cb: firstCallback } },
    );

    rerender({ cb: secondCallback });
    triggerIntersect([{ isIntersecting: true }]);

    expect(firstCallback).not.toHaveBeenCalled();
    expect(secondCallback).toHaveBeenCalledOnce();
  });
});
