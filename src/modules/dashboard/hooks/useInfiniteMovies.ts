import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPopularMovies } from "@/services/movie";

export const useInfiniteMovies = (enabled = true) => {
  return useInfiniteQuery({
    queryKey: ["movies", "popular"],
    queryFn: ({ pageParam }) => fetchPopularMovies(pageParam),
    initialPageParam: 1,
    getNextPageParam: ({ page, totalPages }) =>
      page < totalPages ? page + 1 : undefined,
    enabled,
  });
};
