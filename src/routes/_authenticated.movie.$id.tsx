import { createFileRoute } from "@tanstack/react-router";
import MovieDetail from "@/modules/movie/page/MovieDetail";

export const Route = createFileRoute("/_authenticated/movie/$id")({
  component: () => {
    const { id } = Route.useParams();
    return <MovieDetail id={Number(id)} />;
  },
});
