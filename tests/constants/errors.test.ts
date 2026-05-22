import { describe, it, expect } from "vitest";
import { getQueryErrorMessage } from "@/constants/errors";

const makeAxiosError = (status: number): Error => {
  const error = new Error("Request failed") as Error & {
    isAxiosError: boolean;
    response: { status: number };
  };
  error.isAxiosError = true;
  error.response = { status };
  return error;
};

describe("getQueryErrorMessage", () => {
  it("retorna mensagem genérica para erro comum (não-axios)", () => {
    expect(getQueryErrorMessage(new Error("falha qualquer"))).toBe(
      "Algo deu errado. Tente novamente.",
    );
  });

  it("retorna mensagem de sessão expirada para status 401", () => {
    expect(getQueryErrorMessage(makeAxiosError(401))).toBe(
      "Sessão expirada. Faça login novamente.",
    );
  });

  it("retorna mensagem de não encontrado para status 404", () => {
    expect(getQueryErrorMessage(makeAxiosError(404))).toBe(
      "Conteúdo não encontrado.",
    );
  });

  it("retorna mensagem de rate limit para status 429", () => {
    expect(getQueryErrorMessage(makeAxiosError(429))).toBe(
      "Muitas requisições. Aguarde um instante.",
    );
  });

  it("retorna mensagem de erro de servidor para status 500", () => {
    expect(getQueryErrorMessage(makeAxiosError(500))).toBe(
      "Erro no servidor. Tente novamente.",
    );
  });

  it("retorna mensagem de erro de servidor para status 503", () => {
    expect(getQueryErrorMessage(makeAxiosError(503))).toBe(
      "Erro no servidor. Tente novamente.",
    );
  });

  it("retorna mensagem genérica para status axios desconhecido (ex: 422)", () => {
    expect(getQueryErrorMessage(makeAxiosError(422))).toBe(
      "Algo deu errado. Tente novamente.",
    );
  });

  it("retorna mensagem genérica para erro de rede axios sem response (ex: timeout)", () => {
    const networkError = new Error("Network Error") as Error & {
      isAxiosError: boolean;
    };
    networkError.isAxiosError = true;
    // sem .response — simula timeout/offline
    expect(getQueryErrorMessage(networkError)).toBe(
      "Algo deu errado. Tente novamente.",
    );
  });
});
