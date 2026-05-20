import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Header } from "@/components/Header/Header";
import { useAuthStore } from "@/store/authStore";
import { validateToken } from "@/utils";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    const { token, logout } = useAuthStore.getState();

    if (!token || !validateToken(token)) {
      logout();
      throw redirect({ to: "/login" });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
