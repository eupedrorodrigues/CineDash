import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "@/modules/auth/store/authStore";

beforeEach(() => {
  useAuthStore.setState({ token: null, isAuthenticated: false });
});

describe("authStore", () => {
  describe("estado inicial", () => {
    it("inicia sem token", () => {
      expect(useAuthStore.getState().token).toBeNull();
    });

    it("inicia não autenticado", () => {
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe("login", () => {
    it("armazena o token recebido", () => {
      useAuthStore.getState().login("token-abc-123");
      expect(useAuthStore.getState().token).toBe("token-abc-123");
    });

    it("marca o usuário como autenticado", () => {
      useAuthStore.getState().login("token-abc-123");
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it("substitui token anterior ao fazer novo login", () => {
      useAuthStore.getState().login("token-antigo");
      useAuthStore.getState().login("token-novo");
      expect(useAuthStore.getState().token).toBe("token-novo");
    });

    it("armazena string vazia sem lançar erro", () => {
      expect(() => useAuthStore.getState().login("")).not.toThrow();
      expect(useAuthStore.getState().token).toBe("");
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
  });

  describe("logout", () => {
    it("remove o token", () => {
      useAuthStore.getState().login("token-abc-123");
      useAuthStore.getState().logout();
      expect(useAuthStore.getState().token).toBeNull();
    });

    it("marca o usuário como não autenticado", () => {
      useAuthStore.getState().login("token-abc-123");
      useAuthStore.getState().logout();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it("não falha ao fazer logout sem estar autenticado", () => {
      expect(() => useAuthStore.getState().logout()).not.toThrow();
    });
  });
});
