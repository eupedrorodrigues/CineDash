import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
} from "@tanstack/react-table";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Movie } from "@/types";
import { createWatchlistColumns } from "./Columns";

interface Props {
  movies: Movie[];
  onRemove: (movie: Movie) => void;
}

function SortIndicator({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (!sorted) return <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />;
  return sorted === "asc" ? (
    <ChevronUp className="h-3.5 w-3.5 text-primary" />
  ) : (
    <ChevronDown className="h-3.5 w-3.5 text-primary" />
  );
}

export function WatchlistTable({ movies, onRemove }: Props) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "title", desc: false },
  ]);

  const columns = useMemo(() => createWatchlistColumns(onRemove), [onRemove]);

  const table = useReactTable({
    data: movies,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-xl border border-border/60">
      <table className="w-full text-sm">
        <thead className="border-b border-border/60 bg-card/60">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sorted = header.column.getIsSorted();
                const align = header.column.columnDef.meta?.align;

                return (
                  <th
                    key={header.id}
                    className={cn(
                      "px-4 py-3 text-left font-medium text-muted-foreground",
                      align === "right" && "text-right",
                    )}
                  >
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        onClick={header.column.getToggleSortingHandler()}
                        className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        <SortIndicator sorted={sorted} />
                      </button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-border/40">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="bg-background transition-colors hover:bg-card/60"
            >
              {row.getVisibleCells().map((cell) => {
                const align = cell.column.columnDef.meta?.align;
                return (
                  <td
                    key={cell.id}
                    className={cn(
                      "px-4 py-3",
                      align === "right" && "text-right",
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
