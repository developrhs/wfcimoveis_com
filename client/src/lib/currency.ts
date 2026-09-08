export type PriceCents = number | null | undefined;

const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * The API contract is price_cents: integer cents, never a formatted string.
 * A null price is intentionally rendered as "Consultar valor".
 */
export function formatBRLFromCents(valueInCents: PriceCents): string {
  if (valueInCents === null || valueInCents === undefined) {
    return "Consultar valor";
  }

  const cents = Number(valueInCents);
  if (!Number.isFinite(cents) || cents < 0) {
    return "Consultar valor";
  }

  return brlFormatter.format(cents / 100);
}

/** Converts a Brazilian currency input into integer cents exactly once on save. */
export function parseBRLToCents(input: string): number | null {
  const clean = input.trim().replace(/R\$\s?/g, "");
  if (!clean) return null;

  const normalized = clean.includes(",")
    ? clean.replace(/\./g, "").replace(",", ".")
    : clean.replace(/\s/g, "");
  const amount = Number(normalized);

  if (!Number.isFinite(amount) || amount < 0) return null;
  return Math.round(amount * 100);
}

export function formatBRLInput(input: string): string {
  const cents = parseBRLToCents(input);
  return cents === null ? "" : formatBRLFromCents(cents);
}
