import { FormEvent, useMemo, useState } from "react";
import { Building2, Check, Edit3, Filter, Plus, Search, X } from "lucide-react";

type PropertyStatus = "disponivel" | "reservado" | "vendido";
type Property = {
  id: string;
  title: string;
  location: string;
  type: string;
  price: string;
  status: PropertyStatus;
  updatedAt: string;
};

const initialProperties: Property[] = [
  { id: "01310", title: "Casa dos Sonhos", location: "Jardim das Oliveiras · Senador Canedo", type: "Casa", price: "R$ 420.000", status: "disponivel", updatedAt: "Hoje, 09:42" },
  { id: "01304", title: "Casa térrea com jardim", location: "Residencial Anápolis · Senador Canedo", type: "Casa", price: "R$ 350.000", status: "reservado", updatedAt: "Ontem, 16:10" },
  { id: "01288", title: "Chácara Recanto Verde", location: "Bela Vista de Goiás", type: "Chácara", price: "R$ 265.000", status: "disponivel", updatedAt: "12 set, 14:25" },
  { id: "01270", title: "Lote Jardim Boa Vista", location: "Jardim Boa Vista · Senador Canedo", type: "Loteamento", price: "R$ 99.000", status: "disponivel", updatedAt: "11 set, 11:08" },
];

const statusLabels: Record<PropertyStatus, string> = { disponivel: "Disponível", reservado: "Reservado", vendido: "Vendido" };

export default function PropertiesPanel() {
  const [properties, setProperties] = useState(initialProperties);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | PropertyStatus>("todos");
  const [editing, setEditing] = useState<Property | null>(null);
  const [saved, setSaved] = useState("");

  const filtered = useMemo(() => properties.filter((property) => {
    const haystack = `${property.id} ${property.title} ${property.location} ${property.type}`.toLowerCase();
    return (!query || haystack.includes(query.toLowerCase())) && (statusFilter === "todos" || property.status === statusFilter);
  }), [properties, query, statusFilter]);

  function saveProperty(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setProperties((current) => current.map((property) => property.id === editing.id ? editing : property));
    setEditing(null);
    setSaved(`Imóvel ${editing.id} atualizado apenas nesta prévia local.`);
  }

  return <section aria-labelledby="properties-title">
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm text-slate-400">Catálogo administrativo</p><h2 id="properties-title" className="mt-1 text-2xl font-bold">Imóveis</h2><p className="mt-2 text-sm text-slate-500">Consulte e prepare alterações no inventário da WFC.</p></div><button type="button" onClick={() => setSaved("O cadastro será habilitado quando o endpoint de imóveis estiver disponível.")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"><Plus className="h-4 w-4" /> Novo imóvel</button></div>
    {saved && <p role="status" className="mb-5 flex items-center gap-2 rounded-xl border border-blue-300/20 bg-blue-400/10 px-4 py-3 text-sm text-blue-200"><Check className="h-4 w-4" />{saved}</p>}
    <div className="rounded-2xl border border-white/10 bg-[#101f3d] p-4 sm:p-6"><div className="flex flex-col gap-3 lg:flex-row"><label className="relative flex-1"><span className="sr-only">Buscar imóvel</span><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por código, título, bairro ou tipo" className="w-full rounded-xl border border-white/10 bg-[#0b1730] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-400" /></label><label className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0b1730] px-3"><Filter className="h-4 w-4 text-slate-500" /><span className="sr-only">Filtrar status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "todos" | PropertyStatus)} className="bg-transparent py-3 text-sm text-slate-300 outline-none"><option value="todos">Todos os status</option><option value="disponivel">Disponíveis</option><option value="reservado">Reservados</option><option value="vendido">Vendidos</option></select></label></div>
      <div className="mt-5 flex items-center justify-between border-b border-white/10 pb-4 text-xs text-slate-500"><span>{filtered.length} de {properties.length} imóveis</span><span className="hidden sm:inline">Prévia visual · dados reais serão conectados pela API</span></div>
      <div className="mt-2 divide-y divide-white/10">{filtered.map((property) => <article key={property.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-center gap-4"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-300"><Building2 className="h-5 w-5" /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate font-semibold text-white">{property.title}</h3><span className="text-xs text-slate-600">#{property.id}</span></div><p className="mt-1 truncate text-xs text-slate-500">{property.type} · {property.location}</p></div></div><div className="flex items-center justify-between gap-5 sm:justify-end"><div><p className="text-sm font-semibold text-white">{property.price}</p><p className="mt-1 text-[11px] text-slate-600">Atualizado {property.updatedAt}</p></div><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${property.status === "disponivel" ? "bg-emerald-400/10 text-emerald-300" : property.status === "reservado" ? "bg-amber-400/10 text-amber-300" : "bg-slate-400/10 text-slate-400"}`}>{statusLabels[property.status]}</span><button type="button" aria-label={`Editar ${property.title}`} onClick={() => { setSaved(""); setEditing(property); }} className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:border-blue-300/30 hover:text-blue-300"><Edit3 className="h-4 w-4" /></button></div></article>)}</div>
      {filtered.length === 0 && <div className="py-12 text-center text-sm text-slate-500">Nenhum imóvel corresponde aos filtros atuais.</div>}
    </div>
    {editing && <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-5 py-8"><section role="dialog" aria-modal="true" aria-labelledby="edit-property-title" className="max-h-full w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-[#101f3d] p-6 shadow-2xl sm:p-7"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">Cadastro de imóvel</p><h2 id="edit-property-title" className="mt-2 text-xl font-bold">Editar #{editing.id}</h2></div><button type="button" aria-label="Fechar edição" onClick={() => setEditing(null)} className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button></div><form onSubmit={saveProperty} className="mt-6 space-y-4"><label className="block text-sm text-slate-300">Título<input required value={editing.title} onChange={(event) => setEditing({ ...editing, title: event.target.value })} className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b1730] px-3 py-3 text-white outline-none focus:border-blue-400" /></label><label className="block text-sm text-slate-300">Localização<input required value={editing.location} onChange={(event) => setEditing({ ...editing, location: event.target.value })} className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b1730] px-3 py-3 text-white outline-none focus:border-blue-400" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm text-slate-300">Tipo<input required value={editing.type} onChange={(event) => setEditing({ ...editing, type: event.target.value })} className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b1730] px-3 py-3 text-white outline-none focus:border-blue-400" /></label><label className="block text-sm text-slate-300">Preço<input required value={editing.price} onChange={(event) => setEditing({ ...editing, price: event.target.value })} className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b1730] px-3 py-3 text-white outline-none focus:border-blue-400" /></label></div><label className="block text-sm text-slate-300">Status<select value={editing.status} onChange={(event) => setEditing({ ...editing, status: event.target.value as PropertyStatus })} className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b1730] px-3 py-3 text-white outline-none focus:border-blue-400"><option value="disponivel">Disponível</option><option value="reservado">Reservado</option><option value="vendido">Vendido</option></select></label><p className="rounded-lg border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs leading-5 text-amber-200">Esta edição é uma prévia local. A gravação no banco será ativada quando Orion disponibilizar o endpoint autenticado de imóveis.</p><div className="flex gap-3 pt-2"><button type="button" onClick={() => setEditing(null)} className="flex-1 rounded-lg border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5">Cancelar</button><button type="submit" className="flex-1 rounded-lg bg-blue-500 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-400">Salvar prévia</button></div></form></section></div>}
  </section>;
}
