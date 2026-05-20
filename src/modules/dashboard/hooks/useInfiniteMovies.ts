import { useInfiniteQuery } from "@tanstack/react-query";
import { moviePopular } from "@/services/movie";

export const useInfiniteMovies = () => {
  return useInfiniteQuery({
    queryKey: ["movies", "popular"],
    queryFn: ({ pageParam }) => moviePopular(pageParam),
    initialPageParam: 1,
    getNextPageParam: ({ page, totalPages }) =>
      page < totalPages ? page + 1 : undefined,
  });
};
