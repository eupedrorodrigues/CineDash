import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Info, Star, TrendingUp, Clock } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

const MOCK_MOVIES = [
  {
    id: 1,
    title: "Interstellar",
    rating: 8.7,
    duration: "2h 49m",
    genre: "Sci-Fi",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=60",
    trending: true
  },
  {
    id: 2,
    title: "The Dark Knight",
    rating: 9.0,
    duration: "2h 32m",
    genre: "Action",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&auto=format&fit=crop&q=60",
    trending: true
  },
  {
    id: 3,
    title: "Inception",
    rating: 8.8,
    duration: "2h 28m",
    genre: "Sci-Fi",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=60",
    trending: false
  },
  {
    id: 4,
    title: "Arrival",
    rating: 7.9,
    duration: "1h 56m",
    genre: "Sci-Fi",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=60",
    trending: false
  }
]

function Dashboard() {
  const { data: movies, isLoading } = useQuery({
    queryKey: ['movies'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 800))
      return MOCK_MOVIES
    }
  })

  return (
    <div className="container py-8 space-y-12">
      <section className="relative h-[450px] rounded-3xl overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1600&auto=format&fit=crop&q=80" 
          alt="Featured Movie"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-10 space-y-4 max-w-2xl">
          <div className="flex items-center gap-2 text-red-500 font-semibold uppercase tracking-wider text-sm">
            <TrendingUp size={16} />
            Trending Now
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white">DUNE: PART TWO</h1>
          <p className="text-zinc-300 text-lg line-clamp-2">
            Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.
          </p>
          <div className="flex gap-4 pt-4">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8">
              <Play className="mr-2 h-5 w-5 fill-current" /> Watch Now
            </Button>
            <Button size="lg" variant="outline" className="rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20">
              <Info className="mr-2 h-5 w-5" /> More Info
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Recommended for You</h2>
          <Button variant="link" className="text-zinc-400 hover:text-white">View All</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-[300px] rounded-xl bg-zinc-800 animate-pulse" />
            ))
          ) : (
            movies?.map((movie) => (
              <Card key={movie.id} className="group border-0 bg-transparent overflow-hidden">
                <CardHeader className="p-0 relative aspect-[2/3] overflow-hidden rounded-xl">
                  <img 
                    src={movie.image} 
                    alt={movie.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="icon" variant="secondary" className="rounded-full">
                      <Play className="h-5 w-5 fill-current" />
                    </Button>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 text-yellow-500 text-xs font-bold">
                    <Star size={12} className="fill-current" />
                    {movie.rating}
                  </div>
                </CardHeader>
                <CardContent className="px-0 py-3">
                  <CardTitle className="text-base font-bold line-clamp-1 group-hover:text-red-500 transition-colors">
                    {movie.title}
                  </CardTitle>
                  <div className="flex items-center gap-3 text-sm text-zinc-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {movie.duration}
                    </span>
                    <span>{movie.genre}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
