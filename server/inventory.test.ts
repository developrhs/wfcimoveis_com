import { describe, expect, it } from "vitest";
import { applySaleToInventory } from "../shared/inventory";

describe("applySaleToInventory", () => {
  it("marks a unit property as sold after the sale", () => {
    expect(applySaleToInventory({ totalQuantity: null, availableQuantity: 1, status: "disponivel" }, 1)).toEqual({
      totalQuantity: null,
      availableQuantity: 0,
      status: "vendido",
    });
  });

  it("decrements a multi-unit development and keeps it available", () => {
    expect(applySaleToInventory({ totalQuantity: 40, availableQuantity: 18, status: "disponivel" }, 3)).toEqual({
      totalQuantity: 40,
      availableQuantity: 15,
      status: "disponivel",
    });
  });

  it("marks a multi-unit development as sold when its stock reaches zero", () => {
    expect(applySaleToInventory({ totalQuantity: 12, availableQuantity: 2, status: "disponivel" }, 2).status).toBe("vendido");
  });

  it("rejects a sale above available stock", () => {
    expect(() => applySaleToInventory({ totalQuantity: 2, availableQuantity: 1, status: "disponivel" }, 2)).toThrow(/estoque/);
  });
});
