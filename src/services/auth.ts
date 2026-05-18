import type { IAuthLoginResponse, ILoginCredentials } from "@/types";

export const authLogin = async (
  data: ILoginCredentials,
): Promise<IAuthLoginResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (!data.email || data.password.length < 6) {
    throw new Error("Credenciais inválidas");
  }

  const token = btoa(`${data.email}:${Date.now()}`);

  return { token };
};
