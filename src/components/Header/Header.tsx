import { Link, useNavigate } from "@tanstack/react-router";
import { Bookmark, Film, LayoutGrid, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { useWatchlistStore } from "@/modules/watchlist/store/watchlistStore";
import { useThemeStore } from "@/store/themeStore";

const Header = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const count = useWatchlistStore((s) => s.movies.length);
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 group shrink-0"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[var(--shadow-gold)]">
            <Film className="h-5 w-5" />
          </div>
          <span className="hidden sm:inline text-lg font-semibold tracking-tight">
            Cine<span className="text-primary">Dash</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            to="/dashboard"
            activeProps={{ className: "bg-secondary text-foreground" }}
            className="flex items-center gap-2 rounded-md px-2 sm:px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LayoutGrid className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Descoberta</span>
          </Link>
          <Link
            to="/watchlist"
            activeProps={{ className: "bg-secondary text-foreground" }}
            className="flex items-center gap-2 rounded-md px-2 sm:px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Bookmark className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Minha Lista</span>
            {count > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"
            }
            className="cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              logout();
              navigate({ to: "/login" });
            }}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export { Header };
