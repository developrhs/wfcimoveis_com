import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Building2, CheckCircle2, LockKeyhole, ShieldCheck, Users } from "lucide-react";

type User = { name?: string; username?: string; role?: string };
type Summary = { properties: number; clients: number; users: number };

async function systemApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/sistema/api/v1/${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error ?? "Não foi possível concluir a operação.");
  return body as T;
}

export default function SystemLanding() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  async function loadSummary() {
    setSummaryLoading(true);
    try {
      const result = await systemApi<{ data: Summary }>("summary");
      setSummary(result.data);
    } catch {
      setSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  }

  useEffect(() => {
    systemApi<{ user: User }>("auth/me")
      .then(async ({ user: currentUser }) => {
        setUser(currentUser);
        await loadSummary();
      })
      .catch(() => undefined);
  }, []);

  function openLogin() {
    setNotice("");
    setError("");
    setLoginOpen(true);
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    try {
      const result = await systemApi<{ user: User }>("auth/login", {
        method: "POST",
        body: JSON.stringify({ identity: identity.trim(), password }),
      });
      setUser(result.user);
      await loadSummary();
      setPassword("");
      setLoginOpen(false);
      setNotice(`Sessão iniciada para ${result.user.name || result.user.username || "usuário"}.`);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Não foi possível entrar no sistema.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await systemApi("auth/logout", { method: "POST" }).catch(() => undefined);
    setUser(null);
    setSummary(null);
    setNotice("Sessão encerrada.");
  }

  return (
    <main className="min-h-screen bg-[#0b1730] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-7 lg:px-12">
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/30"><Building2 className="h-5 w-5" /></div>
            <div><p className="text-lg font-bold tracking-tight">WFCSystem</p><p className="text-xs text-blue-200/70">Painel administrativo</p></div>
          </div>
          <span className="rounded-full border border-blue-300/20 bg-blue-300/10 px-3 py-1.5 text-xs font-medium text-blue-100">ambiente seguro</span>
        </header>

        <section className="grid flex-1 items-center gap-14 py-16 lg:grid-cols-[1.1fr_.9fr] lg:py-24">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-blue-300">Sistema interno WFC Imóveis</p>
            <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-6xl">A operação da sua imobiliária em um só lugar.</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">Um espaço separado do site público para organizar imóveis, clientes, prova social e usuários da equipe.</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              {user ? <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3.5 font-semibold shadow-xl shadow-blue-500/20 transition hover:bg-blue-400">Sair de {user.name || user.username} <ArrowRight className="h-4 w-4" /></button> : <button onClick={openLogin} className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3.5 font-semibold shadow-xl shadow-blue-500/20 transition hover:bg-blue-400">Entrar no sistema <ArrowRight className="h-4 w-4" /></button>}
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3.5 text-sm text-slate-300"><LockKeyhole className="h-4 w-4 text-blue-300" /> Acesso restrito à equipe</span>
            </div>
            {notice && <p className="mt-5 flex items-center gap-2 text-sm text-emerald-300"><CheckCircle2 className="h-4 w-4" />{notice}</p>}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="rounded-2xl border border-white/10 bg-[#111f3d] p-6">
              <div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">Visão geral</p><p className="mt-1 text-xl font-semibold">Central de gestão</p></div><ShieldCheck className="h-6 w-6 text-blue-300" /></div>
              <div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-xl bg-white/[0.06] p-4"><p className="text-xs text-slate-400">Imóveis</p><p className="mt-2 text-2xl font-bold">{summaryLoading ? "…" : summary?.properties ?? "—"}</p></div><div className="rounded-xl bg-white/[0.06] p-4"><p className="text-xs text-slate-400">Clientes</p><p className="mt-2 text-2xl font-bold">{summaryLoading ? "…" : summary?.clients ?? "—"}</p></div><div className="rounded-xl bg-white/[0.06] p-4"><p className="text-xs text-slate-400">Equipe</p><p className="mt-2 text-2xl font-bold">{summaryLoading ? "…" : summary?.users ?? "—"}</p></div><div className="rounded-xl bg-blue-500/20 p-4"><p className="text-xs text-blue-200">Status</p><p className="mt-2 flex items-center gap-2 text-sm font-semibold text-blue-100"><span className="h-2 w-2 rounded-full bg-emerald-400" /> {user ? "Operação ativa" : "Preparado"}</p></div></div>
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 p-4 text-sm text-slate-300"><Users className="h-5 w-5 text-blue-300" /> Módulos administrativos em construção</div>
            </div>
          </div>
        </section>
        <footer className="border-t border-white/10 pt-5 text-xs text-slate-400">WFCSystem · área administrativa · wfcimoveis.com/sistema</footer>
      </div>

      {loginOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-[#050c1bcc] px-6 backdrop-blur-sm"><section role="dialog" aria-modal="true" aria-labelledby="login-title" className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111f3d] p-7 shadow-2xl"><div className="mb-6"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Acesso restrito</p><h2 id="login-title" className="mt-2 text-2xl font-bold">Entrar no WFCSystem</h2><p className="mt-2 text-sm text-slate-400">Use seu usuário ou e-mail cadastrado.</p></div><form onSubmit={handleLogin} className="space-y-4"><label className="block text-sm font-medium text-slate-200">Usuário ou e-mail<input required value={identity} onChange={(event) => setIdentity(event.target.value)} autoComplete="username" className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b1730] px-3 py-3 text-white outline-none ring-blue-400 focus:ring-2" /></label><label className="block text-sm font-medium text-slate-200">Senha<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b1730] px-3 py-3 text-white outline-none ring-blue-400 focus:ring-2" /></label>{error && <p role="alert" className="rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-2 text-sm text-red-200">{error}</p>}<div className="flex gap-3 pt-2"><button type="button" onClick={() => setLoginOpen(false)} className="flex-1 rounded-lg border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5">Cancelar</button><button disabled={loading} type="submit" className="flex-1 rounded-lg bg-blue-500 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-400 disabled:cursor-wait disabled:opacity-60">{loading ? "Entrando…" : "Entrar"}</button></div></form></section></div>}
    </main>
  );
}
