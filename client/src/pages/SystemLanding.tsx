import { FormEvent, ReactNode, useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  MessageSquareQuote,
  Settings2,
  ShoppingBag,
  ShieldCheck,
  Users,
  UsersRound,
  X,
} from "lucide-react";
import { useSystemSession } from "../_core/hooks/useSystemSession";
import PropertiesPanel from "../components/system/PropertiesPanel";

const navigation = [
  { id: "overview", label: "Visão geral", icon: LayoutDashboard },
  { id: "properties", label: "Imóveis", icon: Building2 },
  { id: "clients", label: "Clientes", icon: UsersRound },
  { id: "testimonials", label: "Prova social", icon: MessageSquareQuote },
  { id: "sales", label: "Vendas", icon: ShoppingBag },
  { id: "users", label: "Usuários", icon: Users },
];

export default function SystemLanding() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeModule, setActiveModule] = useState("overview");
  const { user, summary, summaryLoading, sessionChecking, loginLoading, logoutLoading, error, notice, setError, setNotice, login, logout } = useSystemSession();

  function openLogin() {
    setNotice("");
    setError("");
    setLoginOpen(true);
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    const authenticated = await login(identity, password, event);
    if (authenticated) {
      setPassword("");
      setLoginOpen(false);
    }
  }

  const activeLabel = navigation.find((item) => item.id === activeModule)?.label ?? "Visão geral";

  if (user) {
    return (
      <main className="min-h-screen bg-[#09152c] text-white">
        <div className="flex min-h-screen">
          {mobileNavOpen && <button aria-label="Fechar menu" className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setMobileNavOpen(false)} />}
          <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-[#0b1730] px-5 py-6 transition-transform duration-200 lg:static lg:translate-x-0 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/20"><Building2 className="h-5 w-5" /></div><div><p className="font-bold tracking-tight">WFCSystem</p><p className="text-[11px] text-blue-200/60">Painel administrativo</p></div></div>
              <button aria-label="Fechar navegação" className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden" onClick={() => setMobileNavOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-10"><p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Operação</p><nav className="mt-3 space-y-1">{navigation.map((item) => { const Icon = item.icon; const selected = activeModule === item.id; return <button key={item.id} onClick={() => { setActiveModule(item.id); setMobileNavOpen(false); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${selected ? "bg-blue-500/15 text-blue-200" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><Icon className={`h-4 w-4 ${selected ? "text-blue-300" : "text-slate-500"}`} />{item.label}{selected && <ChevronRight className="ml-auto h-4 w-4" />}</button>; })}</nav></div>
            <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.04] p-4"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-blue-500/20 text-sm font-bold text-blue-200">{(user.name || user.username || "U").slice(0, 1).toUpperCase()}</div><div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{user.name || user.username}</p><p className="truncate text-xs text-slate-400">{user.role || "Equipe WFC"}</p></div></div><button disabled={logoutLoading} onClick={logout} className="mt-4 flex w-full items-center gap-2 rounded-lg px-1 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-60"><LogOut className="h-4 w-4" />{logoutLoading ? "Encerrando…" : "Encerrar sessão"}</button></div>
          </aside>
          <section className="min-w-0 flex-1">
            <header className="flex h-20 items-center justify-between border-b border-white/10 px-5 sm:px-8"><div className="flex items-center gap-3"><button aria-label="Abrir menu" className="rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden" onClick={() => setMobileNavOpen(true)}><Menu className="h-5 w-5" /></button><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">WFCSystem</p><h1 className="mt-1 text-xl font-bold">{activeLabel}</h1></div></div><div className="hidden items-center gap-3 sm:flex"><span className="h-2 w-2 rounded-full bg-emerald-400" /><span className="text-xs text-slate-400">Sessão ativa</span><Settings2 className="ml-3 h-4 w-4 text-slate-500" /></div></header>
            <div className="mx-auto max-w-7xl p-5 sm:p-8"><div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm text-slate-400">Olá, {user.name || user.username}.</p><h2 className="mt-1 text-3xl font-bold tracking-tight">Tudo sob controle.</h2></div><span className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300"><ShieldCheck className="h-3.5 w-3.5" /> Ambiente seguro</span></div>
              {notice && <p className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200"><CheckCircle2 className="h-4 w-4" />{notice}</p>}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Imóveis cadastrados" value={summaryLoading ? "…" : summary?.properties ?? "—"} icon={<Building2 className="h-5 w-5" />} /><Metric label="Clientes" value={summaryLoading ? "…" : summary?.clients ?? "—"} icon={<UsersRound className="h-5 w-5" />} /><Metric label="Equipe" value={summaryLoading ? "…" : summary?.users ?? "—"} icon={<Users className="h-5 w-5" />} /><Metric label="Status da sessão" value="Ativa" icon={<ShieldCheck className="h-5 w-5" />} accent /></div>
              {activeModule === "properties" ? <PropertiesPanel /> : <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_.65fr]"><section className="rounded-2xl border border-white/10 bg-[#101f3d] p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">Módulo selecionado</p><h3 className="mt-1 text-xl font-semibold">{activeLabel}</h3></div><span className="rounded-lg bg-blue-500/10 px-3 py-2 text-xs text-blue-200">Estrutura pronta</span></div><p className="mt-6 max-w-xl text-sm leading-7 text-slate-400">A navegação do WFCSystem está preparada para receber os dados e operações deste módulo com permissões por perfil.</p><div className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-300">Próxima etapa: dados reais e ações do módulo <ArrowRight className="h-4 w-4" /></div></section><section className="rounded-2xl border border-white/10 bg-[#101f3d] p-6"><p className="text-sm text-slate-400">Acesso atual</p><p className="mt-2 text-lg font-semibold">{user.role || "Equipe WFC"}</p><p className="mt-1 text-xs text-slate-500">{user.email || user.username}</p><div className="mt-6 flex items-center gap-2 text-xs text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Autenticado</div></section></div>}
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b1730] text-white"><div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-7 lg:px-12"><header className="flex items-center justify-between border-b border-white/10 pb-6"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/30"><Building2 className="h-5 w-5" /></div><div><p className="text-lg font-bold tracking-tight">WFCSystem</p><p className="text-xs text-blue-200/70">Painel administrativo</p></div></div><span className="rounded-full border border-blue-300/20 bg-blue-300/10 px-3 py-1.5 text-xs font-medium text-blue-100">ambiente seguro</span></header><section className="grid flex-1 items-center gap-14 py-16 lg:grid-cols-[1.1fr_.9fr] lg:py-24"><div><p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-blue-300">Sistema interno WFC Imóveis</p><h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-6xl">A operação da sua imobiliária em um só lugar.</h1><p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">Um espaço separado do site público para organizar imóveis, clientes, prova social e usuários da equipe.</p><div className="mt-10 flex flex-wrap items-center gap-4">{user ? null : <button disabled={sessionChecking} onClick={openLogin} className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3.5 font-semibold shadow-xl shadow-blue-500/20 transition hover:bg-blue-400 disabled:cursor-wait disabled:opacity-60">{sessionChecking ? "Verificando sessão…" : "Entrar no sistema"}<ArrowRight className="h-4 w-4" /></button>}<span className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3.5 text-sm text-slate-300"><LockKeyhole className="h-4 w-4 text-blue-300" /> Acesso restrito à equipe</span></div>{notice && <p className="mt-5 flex items-center gap-2 text-sm text-emerald-300"><CheckCircle2 className="h-4 w-4" />{notice}</p>}</div><div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur"><div className="rounded-2xl border border-white/10 bg-[#111f3d] p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">Visão geral</p><p className="mt-1 text-xl font-semibold">Central de gestão</p></div><ShieldCheck className="h-6 w-6 text-blue-300" /></div><div className="mt-7 grid grid-cols-2 gap-3"><Metric label="Imóveis" value={summaryLoading ? "…" : summary?.properties ?? "—"} /><Metric label="Clientes" value={summaryLoading ? "…" : summary?.clients ?? "—"} /><Metric label="Equipe" value={summaryLoading ? "…" : summary?.users ?? "—"} /><Metric label="Status" value="Preparado" accent /></div><div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 p-4 text-sm text-slate-300"><Users className="h-5 w-5 text-blue-300" /> Módulos administrativos em construção</div></div></div></section><footer className="border-t border-white/10 pt-5 text-xs text-slate-400">WFCSystem · área administrativa · wfcimoveis.com/sistema</footer></div>{loginOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-[#050c1bcc] px-6 backdrop-blur-sm"><section role="dialog" aria-modal="true" aria-labelledby="login-title" className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111f3d] p-7 shadow-2xl"><div className="mb-6"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Acesso restrito</p><h2 id="login-title" className="mt-2 text-2xl font-bold">Entrar no WFCSystem</h2><p className="mt-2 text-sm text-slate-400">Use seu usuário ou e-mail cadastrado.</p></div><form onSubmit={handleLogin} className="space-y-4"><label className="block text-sm font-medium text-slate-200">Usuário ou e-mail<input required value={identity} onChange={(event) => setIdentity(event.target.value)} autoComplete="username" className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b1730] px-3 py-3 text-white outline-none ring-blue-400 focus:ring-2" /></label><label className="block text-sm font-medium text-slate-200">Senha<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b1730] px-3 py-3 text-white outline-none ring-blue-400 focus:ring-2" /></label>{error && <p role="alert" className="rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-2 text-sm text-red-200">{error}</p>}<div className="flex gap-3 pt-2"><button type="button" onClick={() => setLoginOpen(false)} className="flex-1 rounded-lg border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5">Cancelar</button><button disabled={loginLoading} type="submit" className="flex-1 rounded-lg bg-blue-500 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-400 disabled:cursor-wait disabled:opacity-60">{loginLoading ? "Entrando…" : "Entrar"}</button></div></form></section></div>}</main>
  );
}

function Metric({ label, value, icon, accent = false }: { label: string; value: string | number; icon?: ReactNode; accent?: boolean }) {
  return <div className={`rounded-xl p-4 ${accent ? "bg-blue-500/15" : "bg-white/[0.06]"}`}><div className="flex items-center justify-between"><p className={`text-xs ${accent ? "text-blue-200" : "text-slate-400"}`}>{label}</p>{icon && <span className="text-blue-300">{icon}</span>}</div><p className={`mt-3 text-2xl font-bold ${accent ? "text-blue-100" : "text-white"}`}>{value}</p></div>;
}
