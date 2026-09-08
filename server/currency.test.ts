import { describe, expect, it } from "vitest";
import { formatBRLFromCents, parseBRLToCents } from "../client/src/lib/currency";

describe("WFC currency contract", () => {
  it("formats stored cents as Brazilian reais without inflating the value", () => {
    expect(formatBRLFromCents(42000000)).toBe("R$ 420.000,00");
    expect(formatBRLFromCents(35000000)).toBe("R$ 350.000,00");
    expect(formatBRLFromCents(201000)).toBe("R$ 2.010,00");
  });

  it("keeps undisclosed prices explicit", () => {
    expect(formatBRLFromCents(null)).toBe("Consultar valor");
    expect(formatBRLFromCents(undefined)).toBe("Consultar valor");
  });

  it("converts a Brazilian input to cents exactly once", () => {
    expect(parseBRLToCents("420000")).toBe(42000000);
    expect(parseBRLToCents("R$ 420.000,00")).toBe(42000000);
    expect(parseBRLToCents("2.010,00")).toBe(201000);
    expect(parseBRLToCents("-10")).toBeNull();
    expect(parseBRLToCents("")).toBeNull();
  });
});
