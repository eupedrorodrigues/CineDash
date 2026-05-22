import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const mockNavigate = vi.fn();

vi.mock("@/services/auth", () => ({ authLogin: vi.fn() }));
vi.mock("@tanstack/react-router", () => ({ useNavigate: () => mockNavigate }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { vi as _vi } from "vitest";
import { authLogin } from "@/services/auth";
import { toast } from "sonner";
import { useLogin } from "@/modules/auth/hooks/useLogin";
import { useAuthStore } from "@/modules/auth/store/authStore";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

beforeEach(() => {
  useAuthStore.setState({ token: null, isAuthenticated: false });
  vi.clearAllMocks();
});

describe("useLogin", () => {
  describe("onSuccess", () => {
    it("armazena o token no authStore", async () => {
      vi.mocked(authLogin).mockResolvedValue({ token: "token-teste" });

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });
      act(() => result.current.mutate({ email: "user@test.com", password: "senha123" }));

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(useAuthStore.getState().token).toBe("token-teste");
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it("navega para /dashboard", async () => {
      vi.mocked(authLogin).mockResolvedValue({ token: "token-teste" });

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });
      act(() => result.current.mutate({ email: "user@test.com", password: "senha123" }));

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/dashboard" });
    });

    it("exibe toast de sucesso", async () => {
      vi.mocked(authLogin).mockResolvedValue({ token: "token-teste" });

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });
      act(() => result.current.mutate({ email: "user@test.com", password: "senha123" }));

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(toast.success).toHaveBeenCalledWith("Login realizado com sucesso!");
    });
  });

  describe("onError", () => {
    it("exibe toast com a mensagem de erro", async () => {
      vi.mocked(authLogin).mockRejectedValue(new Error("Credenciais inválidas"));

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });
      act(() => result.current.mutate({ email: "", password: "abc" }));

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(toast.error).toHaveBeenCalledWith("Credenciais inválidas");
    });

    it("não atualiza o authStore em caso de erro", async () => {
      vi.mocked(authLogin).mockRejectedValue(new Error("Credenciais inválidas"));

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });
      act(() => result.current.mutate({ email: "", password: "abc" }));

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(useAuthStore.getState().token).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it("não navega em caso de erro", async () => {
      vi.mocked(authLogin).mockRejectedValue(new Error("Credenciais inválidas"));

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });
      act(() => result.current.mutate({ email: "", password: "abc" }));

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
