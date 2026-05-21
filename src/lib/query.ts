import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getQueryErrorMessage } from "@/constants";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(getQueryErrorMessage(error));
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});
