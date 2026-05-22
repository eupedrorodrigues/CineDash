import { describe, it, expect, beforeEach } from "vitest";
import { useThemeStore } from "@/store/themeStore";

beforeEach(() => {
  document.documentElement.classList.remove("dark");
  useThemeStore.setState({ theme: "dark" });
  document.documentElement.classList.add("dark");
});

describe("themeStore", () => {
  describe("estado inicial", () => {
    it("tema padrão é dark", () => {
      expect(useThemeStore.getState().theme).toBe("dark");
    });
  });

  describe("toggleTheme", () => {
    it("alterna de dark para light", () => {
      useThemeStore.getState().toggleTheme();
      expect(useThemeStore.getState().theme).toBe("light");
    });

    it("alterna de light para dark", () => {
      useThemeStore.setState({ theme: "light" });
      useThemeStore.getState().toggleTheme();
      expect(useThemeStore.getState().theme).toBe("dark");
    });

    it("é idempotente em dois toggles consecutivos", () => {
      useThemeStore.getState().toggleTheme();
      useThemeStore.getState().toggleTheme();
      expect(useThemeStore.getState().theme).toBe("dark");
    });

    it("remove a classe .dark do <html> ao ir para light", () => {
      useThemeStore.getState().toggleTheme();
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("adiciona a classe .dark ao <html> ao voltar para dark", () => {
      useThemeStore.setState({ theme: "light" });
      document.documentElement.classList.remove("dark");

      useThemeStore.getState().toggleTheme();

      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });

  describe("onRehydrateStorage", () => {
    it("aplica o tema correto ao DOM ao reidratar a store", async () => {
      localStorage.setItem(
        "cinedash-theme",
        JSON.stringify({ state: { theme: "light" }, version: 0 }),
      );
      document.documentElement.classList.add("dark");

      await useThemeStore.persist.rehydrate();

      expect(document.documentElement.classList.contains("dark")).toBe(false);

      localStorage.removeItem("cinedash-theme");
    });
  });
});
