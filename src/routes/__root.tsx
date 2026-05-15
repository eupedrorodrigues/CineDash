import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold sm:inline-block text-xl tracking-tighter">
                CINE<span className="text-red-600">DASH</span>
              </span>
            </Link>
            <div className="flex gap-6 text-sm font-medium">
              <Link to="/" className="transition-colors hover:text-foreground/80 [&.active]:text-foreground">
                Dashboard
              </Link>
              <Link to="/about" className="transition-colors hover:text-foreground/80 [&.active]:text-foreground">
                Browse
              </Link>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* Search bar could go here */}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  ),
})
