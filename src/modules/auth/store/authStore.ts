import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState } from "@/types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      login: (token: string) => set({ token, isAuthenticated: true }),
      logout: () => set({ token: null, isAuthenticated: false }),
    }),
    {
      name: "cinedash-auth",
    },
  ),
);
