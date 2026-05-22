import { httpClient } from "@/lib/axios";
import type { AxiosRequestConfig, Method } from "axios";

export const apiRequest = async <T>(
  method: Method,
  url: string,
  payload?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const { data } = await httpClient.request<T>({
    method,
    url,
    data: payload,
    ...config,
  });
  return data;
};
