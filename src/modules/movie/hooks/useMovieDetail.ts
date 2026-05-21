import { useQuery } from "@tanstack/react-query";
import { fetchMovieDetail } from "@/services/movie";

export const useMovieDetail = (id: number) =>
  useQuery({
    queryKey: ["movie", id],
    queryFn: () => fetchMovieDetail(id),
    staleTime: 1000 * 60 * 10,
  });
