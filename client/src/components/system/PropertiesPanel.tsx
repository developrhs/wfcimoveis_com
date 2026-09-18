import { useEffect, useMemo, useState } from "react";
import { Building2, Filter, RefreshCw, Search } from "lucide-react";
import { fetchPublicProperties, PublicProperty } from "@/lib/publicProperties";
import { formatBRLFromCents } from "@/lib/currency";

type PropertyStatus = PublicProperty["status"];

const statusLabels: Record<PropertyStatus, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
};

export default function PropertiesPanel() {
  const [properties, setProperties] = useState<PublicProperty[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | PropertyStatus>("todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProperties(signal?: AbortSignal) {
    setLoading(true);
    setError("");
    try {
      setProperties(await fetchPublicProperties(signal));
    } catch (reason: unknown) {
      if ((reason as Error)?.name !== "AbortError") {
        setError(reason instanceof Error ? reason.message : "Não foi possível carregar os imóveis do banco de dados.");
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    void loadProperties(controller.signal);
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => properties.filter((property) => {
    const haystack = `${property.id} ${property.title} ${property.location} ${property.type}`.toLowerCase();
    return (!query || haystack.includes(query.toLowerCase())) && (statusFilter === "todos" || property.status === statusFilter);
  }), [properties, query, statusFilter]);

  return <section aria-labelledby="properties-title">
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-sm text-slate-400">Catálogo administrativo</p><h2 id="properties-title" className="mt-1 text-2xl font-bold">Imóveis</h2><p className="mt-2 text-sm text-slate-500">Consulta somente os imóveis publicados no banco de dados.</p></div>
      <button type="button" onClick={() => void loadProperties()} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-blue-300/30 hover:text-blue-200 disabled:cursor-wait disabled:opacity-60"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Atualizar dados</button>
    </div>
    {error && <div role="alert" className="mb-5 rounded-xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</div>}
    <div className="rounded-2xl border border-white/10 bg-[#101f3d] p-4 sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row"><label className="relative flex-1"><span className="sr-only">Buscar imóvel</span><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por código, título, bairro ou tipo" className="w-full rounded-xl border border-white/10 bg-[#0b1730] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-400" /></label><label className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0b1730] px-3"><Filter className="h-4 w-4 text-slate-500" /><span className="sr-only">Filtrar status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "todos" | PropertyStatus)} className="bg-transparent py-3 text-sm text-slate-300 outline-none"><option value="todos">Todos os status</option><option value="disponivel">Disponíveis</option><option value="reservado">Reservados</option><option value="vendido">Vendidos</option></select></label></div>
      <div className="mt-5 flex items-center justify-between border-b border-white/10 pb-4 text-xs text-slate-500"><span>{loading ? "Carregando…" : `${filtered.length} de ${properties.length} imóveis`}</span><span className="hidden sm:inline">Fonte: banco de dados via API</span></div>
      {loading && <div className="py-12 text-center text-sm text-slate-400">Carregando imóveis do banco de dados…</div>}
      {!loading && !error && filtered.length === 0 && <div className="py-12 text-center text-sm text-slate-500">Nenhum imóvel real corresponde aos filtros atuais.</div>}
      {!loading && <div className="mt-2 divide-y divide-white/10">{filtered.map((property) => <article key={property.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-center gap-4"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-300"><Building2 className="h-5 w-5" /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate font-semibold text-white">{property.title}</h3><span className="text-xs text-slate-600">#{property.id}</span></div><p className="mt-1 truncate text-xs text-slate-500">{property.type} · {property.location}</p></div></div><div className="flex items-center justify-between gap-5 sm:justify-end"><div><p className="text-sm font-semibold text-white">{formatBRLFromCents(property.price)}</p><p className="mt-1 text-[11px] text-slate-600">{property.available}{property.total ? ` de ${property.total}` : " unidade(s)"}</p></div><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${property.status === "disponivel" ? "bg-emerald-400/10 text-emerald-300" : property.status === "reservado" ? "bg-amber-400/10 text-amber-300" : "bg-slate-400/10 text-slate-400"}`}>{statusLabels[property.status]}</span></div></article>)}</div>}
    </div>
  </section>;
}
