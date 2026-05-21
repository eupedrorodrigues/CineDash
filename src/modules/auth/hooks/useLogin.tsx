import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

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
      navigate({ to: "/dashboard" });
    },
    onError: (error: Error) => {
      console.error(error);
    },
  });
};
