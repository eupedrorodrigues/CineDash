import { describe, it, expect, vi } from "vitest";
import { validateToken } from "@/utils/auth";

const makeToken = (offsetMs: number) => {
  const timestamp = Date.now() + offsetMs;
  return btoa(`user@test.com:${timestamp}`);
};

describe("validateToken", () => {
  it("retorna true para token recém-gerado", () => {
    expect(validateToken(makeToken(0))).toBe(true);
  });

  it("retorna true para token gerado há 59min (dentro do prazo)", () => {
    const fiftyNineMinutes = -59 * 60 * 1000;
    expect(validateToken(makeToken(fiftyNineMinutes))).toBe(true);
  });

  it("retorna false para token expirado (mais de 1h)", () => {
    const twoHours = -2 * 60 * 60 * 1000;
    expect(validateToken(makeToken(twoHours))).toBe(false);
  });

  it("retorna false para string vazia", () => {
    expect(validateToken("")).toBe(false);
  });

  it("retorna false para base64 inválido", () => {
    expect(validateToken("!!!não-é-base64!!!")).toBe(false);
  });

  it("retorna false para token sem timestamp numérico", () => {
    expect(validateToken(btoa("user@test.com:nao-e-numero"))).toBe(false);
  });

  it("usa Date.now para comparar expiração", () => {
    const frozenNow = Date.now();
    vi.spyOn(Date, "now").mockReturnValue(frozenNow);

    const token = btoa(`user@test.com:${frozenNow}`);
    expect(validateToken(token)).toBe(true);

    vi.restoreAllMocks();
  });

  it("retorna false para token exatamente no limite de 1h (boundary exclusivo)", () => {
    const exactly1h = -60 * 60 * 1000;
    expect(validateToken(makeToken(exactly1h))).toBe(false);
  });

  it("retorna false para token sem separador ':'", () => {
    expect(validateToken(btoa("semSeparador"))).toBe(false);
  });
});
