import { describe, it, expect } from "vitest";
import { YEARS } from "@/constants/dashboard";

describe("YEARS", () => {
  const currentYear = new Date().getFullYear();

  it("o primeiro elemento é o ano atual", () => {
    expect(YEARS[0]).toBe(String(currentYear));
  });

  it("o último elemento é '1990'", () => {
    expect(YEARS[YEARS.length - 1]).toBe("1990");
  });

  it("contém exatamente currentYear - 1989 elementos", () => {
    expect(YEARS).toHaveLength(currentYear - 1989);
  });

  it("todos os elementos são strings", () => {
    expect(YEARS.every((y) => typeof y === "string")).toBe(true);
  });

  it("anos estão em ordem decrescente", () => {
    for (let i = 0; i < YEARS.length - 1; i++) {
      expect(Number(YEARS[i])).toBeGreaterThan(Number(YEARS[i + 1]));
    }
  });
});
