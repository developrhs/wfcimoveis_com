import { ArrowRight, Building2, LockKeyhole, ShieldCheck, Users } from "lucide-react";

export default function SystemLanding() {
  return (
    <main className="min-h-screen bg-[#0b1730] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-7 lg:px-12">
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/30">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">WFCSystem</p>
              <p className="text-xs text-blue-200/70">Painel administrativo</p>
            </div>
          </div>
          <span className="rounded-full border border-blue-300/20 bg-blue-300/10 px-3 py-1.5 text-xs font-medium text-blue-100">
            ambiente seguro
          </span>
        </header>

        <section className="grid flex-1 items-center gap-14 py-16 lg:grid-cols-[1.1fr_.9fr] lg:py-24">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-blue-300">Sistema interno WFC Imóveis</p>
            <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-6xl">
              A operação da sua imobiliária em um só lugar.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
              Um espaço separado do site público para organizar imóveis, clientes, prova social e usuários da equipe.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3.5 font-semibold shadow-xl shadow-blue-500/20 transition hover:bg-blue-400">
                Entrar no sistema <ArrowRight className="h-4 w-4" />
              </button>
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3.5 text-sm text-slate-300">
                <LockKeyhole className="h-4 w-4 text-blue-300" /> Acesso restrito à equipe
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="rounded-2xl border border-white/10 bg-[#111f3d] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Visão geral</p>
                  <p className="mt-1 text-xl font-semibold">Central de gestão</p>
                </div>
                <ShieldCheck className="h-6 w-6 text-blue-300" />
              </div>
              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/[0.06] p-4"><p className="text-xs text-slate-400">Imóveis</p><p className="mt-2 text-2xl font-bold">—</p></div>
                <div className="rounded-xl bg-white/[0.06] p-4"><p className="text-xs text-slate-400">Clientes</p><p className="mt-2 text-2xl font-bold">—</p></div>
                <div className="rounded-xl bg-white/[0.06] p-4"><p className="text-xs text-slate-400">Equipe</p><p className="mt-2 text-2xl font-bold">—</p></div>
                <div className="rounded-xl bg-blue-500/20 p-4"><p className="text-xs text-blue-200">Status</p><p className="mt-2 flex items-center gap-2 text-sm font-semibold text-blue-100"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Preparado</p></div>
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 p-4 text-sm text-slate-300"><Users className="h-5 w-5 text-blue-300" /> Módulos administrativos em construção</div>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 pt-5 text-xs text-slate-400">WFCSystem · área administrativa · wfcimoveis.com/sistema</footer>
      </div>
    </main>
  );
}
