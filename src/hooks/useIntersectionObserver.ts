import { useEffect, useRef, type RefObject } from "react";

export function useIntersectionObserver(
  ref: RefObject<Element | null>,
  onIntersect: () => void,
  options?: IntersectionObserverInit,
) {
  const callbackRef = useRef(onIntersect);
  callbackRef.current = onIntersect;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) callbackRef.current();
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
    // options é estável por design (IntersectionObserver não permite mudar após criação)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}
