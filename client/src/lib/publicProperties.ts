export const PUBLIC_PROPERTIES_API = "/sistema/api/v1/public/properties";

export type PublicProperty = {
  id: string;
  title: string;
  type: string;
  saleType: string;
  location: string;
  price: number;
  status: "disponivel" | "reservado" | "vendido";
  available: number;
  total: number | null;
  bedrooms: number;
  baths: number;
  area: string;
  images: string[];
  image: string | null;
  tag: string;
};

function mediaUrl(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const candidate = item.url ?? item.src ?? item.path ?? item.caminho ?? item.fileUrl ?? item.file_url;
  return typeof candidate === "string" && candidate.trim() ? candidate.trim() : null;
}

function mediaList(raw: Record<string, unknown>): string[] {
  const candidates = [raw.images, raw.media, raw.midia, raw.fotos, raw.galeria];
  for (const candidate of candidates) {
    if (!Array.isArray(candidate)) continue;
    const urls = candidate.map(mediaUrl).filter((value): value is string => Boolean(value));
    if (urls.length) return urls;
  }
  const single = mediaUrl(raw.image ?? raw.foto ?? raw.imagem);
  return single ? [single] : [];
}

export function normalizePublicProperty(raw: unknown): PublicProperty {
  const item = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const images = mediaList(item);
  const status = item.status === "reservado" || item.status === "vendido" ? item.status : "disponivel";
  return {
    id: String(item.id ?? item.codigo ?? ""),
    title: String(item.title ?? item.titulo ?? "Imóvel WFC"),
    type: String(item.type ?? item.tipo ?? "Imóvel"),
    saleType: String(item.saleType ?? item.tipoVenda ?? item.sale_type ?? "Consulte"),
    location: String(item.location ?? item.localizacao ?? item.endereco ?? ""),
    price: Number(item.price ?? item.price_cents ?? item.valor_centavos ?? item.valor ?? 0),
    status,
    available: Number(item.available ?? item.disponivel ?? 1),
    total: item.total == null ? null : Number(item.total),
    bedrooms: Number(item.bedrooms ?? item.quartos ?? 0),
    baths: Number(item.baths ?? item.banheiros ?? 0),
    area: String(item.area ?? item.metragem ?? ""),
    images,
    image: images[0] ?? null,
    tag: String(item.tag ?? item.destaque ?? "WFC Imóveis"),
  };
}

export async function fetchPublicProperties(signal?: AbortSignal): Promise<PublicProperty[]> {
  const response = await fetch(PUBLIC_PROPERTIES_API, { signal, headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Não foi possível carregar o catálogo (HTTP ${response.status}).`);
  const body = await response.json() as { items?: unknown };
  if (!Array.isArray(body.items)) throw new Error("A API retornou um catálogo inválido.");
  return body.items.map(normalizePublicProperty).filter((property) => property.id);
}

export function propertyImage(property: PublicProperty): string | null {
  return property.image;
}

export function propertyContactLink(property: PublicProperty, whatsapp: string): string {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Olá, tenho interesse no imóvel ${property.id} — ${property.title}.`)}`;
}
