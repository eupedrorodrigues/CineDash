import { httpClient } from "@/lib/axios";
import type { AxiosRequestConfig, Method } from "axios";

const baseRequest = async <T>(
  method: Method,
  url: string,
  payload?: unknown,
  config?: AxiosRequestConfig,
) => {
  const { data } = await httpClient.request<T>({
    method,
    url,
    data: payload,
    ...config,
  });

  return data;
};

export default baseRequest;
