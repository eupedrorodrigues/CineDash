import { createFileRoute } from "@tanstack/react-router";
import { Watchlist } from "@/modules/watchlist/page/Watchlist";

export const Route = createFileRoute("/_authenticated/watchlist")({
  component: Watchlist,
});
