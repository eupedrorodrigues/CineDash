import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/movie/$id")({
  component: MovieDetails,
});

function MovieDetails() {
  const { id } = Route.useParams();
  return (
    <div className="p-6 text-foreground">
      <h1 className="text-2xl font-bold">Detalhes do Filme</h1>
      <p className="mt-2 text-muted-foreground">ID do filme: {id}</p>
    </div>
  );
}
