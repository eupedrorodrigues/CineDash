import { describe, it, expect } from "vitest";
import { loginSchema } from "@/modules/auth/components/login-form/schemas";

describe("loginSchema", () => {
  describe("username (email)", () => {
    it("aceita email válido", () => {
      const result = loginSchema.safeParse({
        username: "user@example.com",
        password: "senha123",
      });
      expect(result.success).toBe(true);
    });

    it("rejeita campo vazio", () => {
      const result = loginSchema.safeParse({ username: "", password: "senha123" });
      expect(result.success).toBe(false);
      const messages = result.error!.issues.map((i) => i.message);
      expect(messages).toContain("Mínimo de 1 caractere");
    });

    it("rejeita formato inválido de email", () => {
      const result = loginSchema.safeParse({ username: "nao-e-email", password: "senha123" });
      expect(result.success).toBe(false);
      const messages = result.error!.issues.map((i) => i.message);
      expect(messages).toContain("E-mail inválido");
    });

    it("rejeita email com mais de 128 caracteres", () => {
      const long = "a".repeat(120) + "@test.com";
      const result = loginSchema.safeParse({ username: long, password: "senha123" });
      expect(result.success).toBe(false);
      const messages = result.error!.issues.map((i) => i.message);
      expect(messages).toContain("Máximo de 128 caracteres");
    });

    it("faz trim antes de validar (espaços em branco)", () => {
      const result = loginSchema.safeParse({ username: "   ", password: "senha123" });
      expect(result.success).toBe(false);
    });

    it("aceita email válido com espaços ao redor após trim", () => {
      const result = loginSchema.safeParse({
        username: "  user@example.com  ",
        password: "senha123",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("password", () => {
    it("aceita senha com exatamente 6 caracteres", () => {
      const result = loginSchema.safeParse({ username: "user@test.com", password: "abc123" });
      expect(result.success).toBe(true);
    });

    it("aceita senha com exatamente 12 caracteres", () => {
      const result = loginSchema.safeParse({ username: "user@test.com", password: "abcdefghij12" });
      expect(result.success).toBe(true);
    });

    it("rejeita senha com menos de 6 caracteres", () => {
      const result = loginSchema.safeParse({ username: "user@test.com", password: "abc" });
      expect(result.success).toBe(false);
      const messages = result.error!.issues.map((i) => i.message);
      expect(messages).toContain("Mínimo de 6 caracteres");
    });

    it("rejeita senha com mais de 12 caracteres", () => {
      const result = loginSchema.safeParse({ username: "user@test.com", password: "muitolonga1234" });
      expect(result.success).toBe(false);
      const messages = result.error!.issues.map((i) => i.message);
      expect(messages).toContain("Máximo de 12 caracteres");
    });

    it("faz trim antes de validar (espaços em branco)", () => {
      const result = loginSchema.safeParse({ username: "user@test.com", password: "      " });
      expect(result.success).toBe(false);
    });
  });
});
