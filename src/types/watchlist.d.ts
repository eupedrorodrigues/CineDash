export type SortKey = "title" | "genre" | "rating";
export type SortDir = "asc" | "desc";

export interface SortableHeaderProps {
  label: string;
  col: SortKey;
  active: SortKey;
  dir: SortDir;
  onSort: (col: SortKey) => void;
}
