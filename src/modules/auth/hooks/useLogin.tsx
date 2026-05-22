import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { authLogin } from "@/services/auth";
import type { ILoginCredentials } from "@/types";
import { useAuthStore } from "../store/authStore";

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: ILoginCredentials) => authLogin(credentials),
    onSuccess: ({ token }) => {
      login(token);
      toast.success("Login realizado com sucesso!");
      navigate({ to: "/dashboard" });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Credenciais inválidas. Tente novamente.");
    },
  });
};
