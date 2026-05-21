const CURRENT_YEAR = new Date().getFullYear();
export const YEARS = Array.from({ length: CURRENT_YEAR - 1989 }, (_, i) =>
  String(CURRENT_YEAR - i),
);

export const SENTINEL_OPTIONS: IntersectionObserverInit = {
  rootMargin: "200px",
};
