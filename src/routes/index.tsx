import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../store/authStore";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: Index,
});

function Index() {
  return <div>Página inicial (Estante / Busca) - Protegida</div>;
}
