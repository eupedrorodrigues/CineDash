import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/types";

const columnHelper = createColumnHelper<Movie>();

export const createWatchlistColumns = (onRemove: (movie: Movie) => void) => [
  columnHelper.accessor("title", {
    header: "Título",
    cell: ({ getValue, row }) => (
      <div className="flex items-center gap-2 sm:gap-3">
        <img
          src={row.original.poster}
          alt={getValue()}
          className="h-10 w-7 shrink-0 rounded object-cover sm:h-12 sm:w-8"
        />
        <span className="line-clamp-2 max-w-[120px] font-medium sm:max-w-none sm:line-clamp-1">
          {getValue()}
        </span>
      </div>
    ),
  }),
  columnHelper.accessor("genre", {
    header: "Gênero",
    meta: { className: "hidden sm:table-cell" },
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue()}</span>
    ),
  }),
  columnHelper.accessor("year", {
    header: "Ano",
    meta: { className: "hidden sm:table-cell" },
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue()}</span>
    ),
  }),
  columnHelper.accessor("rating", {
    header: "Nota",
    cell: ({ getValue }) => (
      <span className="font-semibold text-primary">
        {getValue().toFixed(1)}
      </span>
    ),
  }),
  columnHelper.display({
    id: "actions",
    header: () => null,
    meta: { align: "right" },
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link to="/movie/$id" params={{ id: String(row.original.id) }}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(row.original)}
          className="text-destructive hover:text-destructive cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  }),
];
