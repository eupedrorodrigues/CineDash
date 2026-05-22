import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    env: {
      VITE_TMDB_IMAGE_BASE_URL: "https://image.tmdb.org/t/p/w500",
      VITE_TMDB_BACKDROP_BASE_URL: "https://image.tmdb.org/t/p/original",
      VITE_YOUTUBE_EMBED_BASE_URL: "https://www.youtube.com/embed",
      VITE_POSTER_FALLBACK_URL: "https://fallback.com/poster.jpg",
    },
  },
});
