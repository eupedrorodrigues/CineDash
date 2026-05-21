import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import type { Movie } from "@/types";
import type { SortableHeaderProps, SortDir, SortKey } from "@/types";

const SortIcon = ({
  col,
  active,
  dir,
}: {
  col: SortKey;
  active: SortKey;
  dir: SortDir;
}) => {
  if (col !== active)
    return <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />;
  return dir === "asc" ? (
    <ChevronUp className="h-3.5 w-3.5 text-primary" />
  ) : (
    <ChevronDown className="h-3.5 w-3.5 text-primary" />
  );
};

const SortableHeader = ({
  label,
  col,
  active,
  dir,
  onSort,
}: SortableHeaderProps) => {
  return (
    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
      <button
        onClick={() => onSort(col)}
        className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
      >
        {label}
        <SortIcon col={col} active={active} dir={dir} />
      </button>
    </th>
  );
};

const sortMovies = (movies: Movie[], key: SortKey, dir: SortDir): Movie[] => {
  return [...movies].sort((a, b) => {
    const av = key === "rating" ? a[key] : a[key].toLowerCase();
    const bv = key === "rating" ? b[key] : b[key].toLowerCase();
    if (av < bv) return dir === "asc" ? -1 : 1;
    if (av > bv) return dir === "asc" ? 1 : -1;
    return 0;
  });
};

export { SortIcon, SortableHeader, sortMovies };
