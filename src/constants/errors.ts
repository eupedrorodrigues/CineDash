import { isAxiosError } from "axios";

export const getQueryErrorMessage = (error: Error): string => {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 401) return "Sessão expirada. Faça login novamente.";
    if (status === 404) return "Conteúdo não encontrado.";
    if (status === 429) return "Muitas requisições. Aguarde um instante.";
    if (status && status >= 500) return "Erro no servidor. Tente novamente.";
  }
  return "Algo deu errado. Tente novamente.";
};
