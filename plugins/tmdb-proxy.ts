import type { Plugin } from 'vite'

export function tmdbProxy(base: string): Plugin {
  return {
    name: 'tmdb-proxy',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res) => {
        try {
          const upstream = await fetch(`${base}${req.url}`, {
            headers: {
              Authorization: req.headers.authorization ?? '',
              'Accept-Encoding': 'identity',
            },
          })
          const json = await upstream.json()
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Cache-Control', 'no-store')
          res.statusCode = upstream.status
          res.end(JSON.stringify(json))
        } catch (e: any) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: e.message }))
        }
      })
    },
  }
}
