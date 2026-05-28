import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Brain,
  Bell,
  GraduationCap,
  LineChart,
  ShieldCheck,
  Sparkles,
  Users,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EduAnalytics IA — BI Educacional com Inteligência Artificial" },
      { name: "description", content: "Transforme dados escolares em decisões inteligentes. Dashboards, busca ativa e IA pedagógica para equipes gestoras." },
      { property: "og:title", content: "EduAnalytics IA" },
      { property: "og:description", content: "Plataforma SaaS de BI Educacional com IA para diretores e coordenadores." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Logos />
      <Features />
      <Benefits />
      <Pricing />
      <CTASection />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">EduAnalytics<span className="text-primary"> IA</span></span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#funcionalidades" className="text-sm font-medium text-muted-foreground hover:text-foreground">Funcionalidades</a>
          <a href="#beneficios" className="text-sm font-medium text-muted-foreground hover:text-foreground">Benefícios</a>
          <a href="#planos" className="text-sm font-medium text-muted-foreground hover:text-foreground">Planos</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline">Entrar</Link>
          <Button asChild size="sm" className="rounded-full">
            <Link to="/app">Acessar plataforma</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, oklch(0.7 0.2 258 / 0.4), transparent 40%), radial-gradient(circle at 80% 60%, oklch(0.6 0.22 280 / 0.35), transparent 45%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:pb-32 lg:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            BI Educacional + IA Pedagógica
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Transformando dados escolares em <span className="bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">decisões inteligentes</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/75">
            Dashboards executivos, busca ativa automatizada e análises pedagógicas geradas por IA para diretores, coordenadores e supervisores.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full px-8 shadow-lg" style={{ boxShadow: "var(--shadow-glow)" }}>
              <Link to="/app">
                Acessar dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-white/20 bg-white/5 px-8 text-white hover:bg-white/10 hover:text-white">
              <a href="#funcionalidades">Solicitar demonstração</a>
            </Button>
          </div>
          <p className="mt-6 text-xs text-white/50">Sem cartão de crédito • Implantação em 24h • Suporte dedicado</p>
        </div>

        {/* Hero mock dashboard */}
        <div className="relative mx-auto mt-16 max-w-6xl">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur">
            <div className="rounded-2xl bg-card p-6 text-card-foreground shadow-xl">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { l: "Alunos", v: "1.284", c: "text-primary" },
                  { l: "Frequência", v: "94,2%", c: "text-success" },
                  { l: "Em risco", v: "72", c: "text-destructive" },
                  { l: "Média geral", v: "7,8", c: "text-foreground" },
                ].map((k) => (
                  <div key={k.l} className="rounded-xl bg-muted/60 p-4">
                    <p className="text-xs font-medium text-muted-foreground">{k.l}</p>
                    <p className={`mt-1 font-display text-2xl font-bold ${k.c}`}>{k.v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-xl bg-muted/40 p-4 h-40 flex items-end gap-2">
                  {[40, 55, 48, 70, 62, 78, 85, 72, 90, 82, 95, 88].map((h, i) => (
                    <div key={i} className="flex-1 rounded-md" style={{ height: `${h}%`, background: "var(--gradient-primary)", opacity: 0.85 }} />
                  ))}
                </div>
                <div className="rounded-xl bg-muted/40 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold"><Brain className="h-4 w-4 text-primary" /> IA Pedagógica</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">"O 7º ano B apresenta queda de 12% na frequência. Recomendo iniciar busca ativa nos 8 alunos com mais de 5 faltas consecutivas."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Logos() {
  return (
    <section className="border-y border-border/60 bg-muted/30 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">Usado por escolas e redes municipais em todo o Brasil</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-muted-foreground/70">
          {["Rede Saber", "Colégio Vértice", "SEME Sul", "Instituto Liber", "Educa+", "Diretoria 14"].map((n) => (
            <span key={n} className="font-display text-lg font-semibold">{n}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: BarChart3, title: "Dashboards executivos", desc: "KPIs em tempo real de frequência, desempenho, evasão e BNCC." },
    { icon: Brain, title: "IA Pedagógica", desc: "Análises, planos de ação e pareceres gerados automaticamente." },
    { icon: Users, title: "Busca ativa inteligente", desc: "Alunos críticos identificados e contato direto via WhatsApp." },
    { icon: LineChart, title: "Comparativos de turmas", desc: "Ranking, heatmaps e curva de evolução por bimestre." },
    { icon: Bell, title: "Alertas em tempo real", desc: "Notificações priorizadas para frequência e queda de rendimento." },
    { icon: ShieldCheck, title: "Multiescola e seguro", desc: "Isolamento de dados, perfis de acesso e LGPD em primeiro lugar." },
  ];
  return (
    <section id="funcionalidades" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Funcionalidades</p>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Tudo que a equipe gestora precisa em um só lugar</h2>
        <p className="mt-4 text-muted-foreground">Da coleta dos dados ao relatório final — automático, visual e pedagogicamente inteligente.</p>
      </div>
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="group rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1" style={{ boxShadow: "var(--shadow-card)", transition: "var(--transition-smooth)" }}>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section id="beneficios" className="bg-muted/40 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Benefícios</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Decisões pedagógicas em minutos, não em semanas</h2>
          <p className="mt-4 text-muted-foreground">A EduAnalytics IA reduz o tempo gasto em planilhas e libera a equipe para o que importa: o aluno.</p>
          <ul className="mt-8 space-y-4">
            {["Redução de até 32% nas taxas de evasão", "Identificação automática de alunos em risco", "Relatórios pedagógicos prontos em 1 clique", "Comunicação direta com responsáveis via WhatsApp"].map((b) => (
              <li key={b} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                <span className="text-sm">{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border bg-card p-8" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <blockquote className="space-y-4">
            <p className="font-display text-xl leading-relaxed">"Em 3 meses passamos a tomar decisões pedagógicas com base em dados reais. A IA virou parte da nossa rotina de coordenação."</p>
            <footer className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full" style={{ background: "var(--gradient-primary)" }} />
              <div>
                <p className="text-sm font-semibold">Profa. Andrea Lopes</p>
                <p className="text-xs text-muted-foreground">Coordenadora — Rede Saber</p>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    { name: "Básico", price: "R$ 297", desc: "Para escolas até 300 alunos", feats: ["Dashboards essenciais", "Importação Excel/CSV", "1 unidade", "Suporte por e-mail"], cta: "Começar" },
    { name: "Profissional", price: "R$ 697", desc: "Para escolas de médio porte", feats: ["IA Pedagógica completa", "Busca ativa + WhatsApp", "Até 3 unidades", "Relatórios ilimitados", "Suporte prioritário"], cta: "Mais escolhido", featured: true },
    { name: "Rede Municipal", price: "Sob consulta", desc: "Para redes e diretorias", feats: ["Unidades ilimitadas", "API e integrações", "SSO e LGPD", "Onboarding dedicado", "SLA garantido"], cta: "Falar com vendas" },
  ];
  return (
    <section id="planos" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Planos</p>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Escolha o plano ideal para sua escola</h2>
      </div>
      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative rounded-2xl border p-8 ${p.featured ? "border-primary bg-card" : "bg-card"}`}
            style={{ boxShadow: p.featured ? "var(--shadow-elegant)" : "var(--shadow-card)" }}
          >
            {p.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>Mais popular</span>
            )}
            <h3 className="font-display text-xl font-bold">{p.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
            <div className="mt-6 flex items-end gap-1">
              <span className="font-display text-4xl font-bold">{p.price}</span>
              {p.price.startsWith("R$") && <span className="pb-1 text-sm text-muted-foreground">/mês</span>}
            </div>
            <ul className="mt-6 space-y-3">
              {p.feats.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />{f}</li>
              ))}
            </ul>
            <Button asChild className="mt-8 w-full rounded-full" variant={p.featured ? "default" : "outline"}>
              <Link to="/app">{p.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <div className="relative overflow-hidden rounded-3xl p-12 text-center" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, oklch(0.7 0.2 258 / 0.5), transparent 50%)" }} />
        <div className="relative">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Pronto para uma gestão escolar inteligente?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/75">Inicie sua avaliação gratuita e veja a diferença em 14 dias.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full bg-white px-8 text-primary hover:bg-white/90">
              <Link to="/app">Teste grátis</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-white/30 bg-transparent px-8 text-white hover:bg-white/10 hover:text-white">
              <a href="https://wa.me/5500000000000" target="_blank" rel="noreferrer"><MessageCircle className="mr-2 h-4 w-4" />Falar no WhatsApp</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} EduAnalytics IA. Todos os direitos reservados.</p>
        <p>Feito com inteligência para a educação brasileira.</p>
      </div>
    </footer>
  );
}