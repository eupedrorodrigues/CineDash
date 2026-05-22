import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { tmdbProxy } from './plugins/tmdb-proxy'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const TMDB_BASE = env.VITE_TMDB_BASE_URL

  return {
    plugins: [tailwindcss(), react(), TanStackRouterVite(), tmdbProxy(TMDB_BASE)],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
