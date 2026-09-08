export type InventoryStatus = "disponivel" | "reservado" | "vendido";

export type InventorySnapshot = {
  totalQuantity: number | null;
  availableQuantity: number | null;
  status: InventoryStatus;
};

export function applySaleToInventory(
  inventory: InventorySnapshot,
  quantitySold: number,
): InventorySnapshot {
  if (!Number.isInteger(quantitySold) || quantitySold < 1) {
    throw new Error("A quantidade vendida deve ser um inteiro maior que zero.");
  }

  const currentAvailable = inventory.availableQuantity ?? 1;
  if (quantitySold > currentAvailable) {
    throw new Error("A quantidade vendida é maior que o estoque disponível.");
  }

  const nextAvailable = currentAvailable - quantitySold;
  return {
    totalQuantity: inventory.totalQuantity,
    availableQuantity: nextAvailable,
    status: nextAvailable === 0 ? "vendido" : "disponivel",
  };
}
