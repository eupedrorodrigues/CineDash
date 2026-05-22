import { describe, it, expect, vi, afterEach } from "vitest";
import { authLogin } from "@/services/auth";

afterEach(() => {
  vi.useRealTimers();
});

describe("authLogin", () => {
  it("retorna um token para credenciais válidas", async () => {
    vi.useFakeTimers();
    const promise = authLogin({ email: "user@test.com", password: "senha123" });
    await vi.runAllTimersAsync();
    const result = await promise;
    expect(result.token).toBeDefined();
    expect(typeof result.token).toBe("string");
  });

  it("token é base64 contendo o email e um timestamp", async () => {
    vi.useFakeTimers();
    const email = "user@test.com";
    const promise = authLogin({ email, password: "senha123" });
    await vi.runAllTimersAsync();
    const { token } = await promise;
    const decoded = atob(token);
    expect(decoded).toContain(email);
    const timestamp = Number(decoded.split(":")[1]);
    expect(isNaN(timestamp)).toBe(false);
  });

  it("lança erro para email vazio", async () => {
    vi.useFakeTimers();
    const promise = authLogin({ email: "", password: "senha123" });
    const assertion = expect(promise).rejects.toThrow("Credenciais inválidas");
    await vi.runAllTimersAsync();
    await assertion;
  });

  it("lança erro para senha com menos de 6 caracteres", async () => {
    vi.useFakeTimers();
    const promise = authLogin({ email: "user@test.com", password: "abc" });
    const assertion = expect(promise).rejects.toThrow("Credenciais inválidas");
    await vi.runAllTimersAsync();
    await assertion;
  });

  it("aceita senha com exatamente 6 caracteres", async () => {
    vi.useFakeTimers();
    const promise = authLogin({ email: "user@test.com", password: "abc123" });
    await vi.runAllTimersAsync();
    await expect(promise).resolves.toHaveProperty("token");
  });

  it("aceita senha com exatamente 12 caracteres (limite superior)", async () => {
    vi.useFakeTimers();
    const promise = authLogin({
      email: "user@test.com",
      password: "abcdefghij12",
    });
    await vi.runAllTimersAsync();
    await expect(promise).resolves.toHaveProperty("token");
  });

  it("aceita senha composta só de espaços se tiver 6+ chars (sem trim no serviço)", async () => {
    vi.useFakeTimers();
    const promise = authLogin({ email: "user@test.com", password: "      " });
    await vi.runAllTimersAsync();
    await expect(promise).resolves.toHaveProperty("token");
  });
});
