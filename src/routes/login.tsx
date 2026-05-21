import { createFileRoute, redirect } from "@tanstack/react-router";
import Login from "@/modules/auth/page/Login";
import { useAuthStore } from "@/modules/auth/store/authStore";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: Login,
});
