import { createFileRoute } from "@tanstack/react-router";
import { KpiCard } from "@/components/kpi-card";
import { Users, TrendingUp, AlertTriangle, BookOpen, Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

const freq = [
  { m: "Fev", f: 91 }, { m: "Mar", f: 93 }, { m: "Abr", f: 92 }, { m: "Mai", f: 94 },
  { m: "Jun", f: 90 }, { m: "Jul", f: 88 }, { m: "Ago", f: 91 }, { m: "Set", f: 94 },
  { m: "Out", f: 95 }, { m: "Nov", f: 94 },
];
const notas = [
  { b: "1º Bi", port: 7.2, mat: 6.8, cien: 7.5 },
  { b: "2º Bi", port: 7.5, mat: 7.1, cien: 7.6 },
  { b: "3º Bi", port: 7.8, mat: 7.4, cien: 7.9 },
  { b: "4º Bi", port: 8.0, mat: 7.6, cien: 8.1 },
];
const turmas = [
  { t: "6A", n: 8.2 }, { t: "6B", n: 7.5 }, { t: "7A", n: 7.1 }, { t: "7B", n: 6.4 },
  { t: "8A", n: 7.8 }, { t: "8B", n: 7.2 }, { t: "9A", n: 8.5 }, { t: "9B", n: 7.9 },
];

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Visão geral</h1>
          <p className="text-sm text-muted-foreground">Indicadores consolidados — Ano letivo 2026</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Escola", "Série", "Turma", "Disciplina", "Bimestre"].map((f) => (
            <Button key={f} variant="outline" size="sm" className="rounded-full">{f}</Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total de alunos" value="1.284" delta="+3,2%" icon={Users} />
        <KpiCard label="Frequência média" value="94,2%" delta="+1,4%" trend="up" icon={TrendingUp} tone="success" />
        <KpiCard label="Média geral" value="7,8" delta="+0,3" trend="up" icon={BookOpen} />
        <KpiCard label="Alunos em risco" value="72" delta="-8 alunos" trend="down" icon={AlertTriangle} tone="destructive" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5 lg:col-span-2" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Frequência mensal</h3>
              <p className="text-xs text-muted-foreground">Percentual de presença consolidado</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={freq}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.5 0.21 264)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="oklch(0.5 0.21 264)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 250)" />
              <XAxis dataKey="m" stroke="oklch(0.5 0.03 258)" fontSize={12} />
              <YAxis domain={[80, 100]} stroke="oklch(0.5 0.03 258)" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.012 250)" }} />
              <Area type="monotone" dataKey="f" stroke="oklch(0.5 0.21 264)" strokeWidth={2.5} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
              <Brain className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold">Insight da IA</h3>
              <p className="text-xs text-muted-foreground">Gerado há 2 minutos</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            "A turma <b>7º B</b> teve queda de <b>12% na frequência</b> nas últimas 3 semanas. Recomendo iniciar busca ativa dos 8 alunos com mais de 5 faltas consecutivas e agendar reunião com responsáveis."
          </p>
          <Button className="mt-4 w-full rounded-full" size="sm">
            <Sparkles className="mr-2 h-3.5 w-3.5" /> Gerar plano de ação
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <h3 className="mb-1 font-semibold">Evolução de notas por disciplina</h3>
          <p className="mb-4 text-xs text-muted-foreground">Comparativo bimestral</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={notas}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 250)" />
              <XAxis dataKey="b" stroke="oklch(0.5 0.03 258)" fontSize={12} />
              <YAxis domain={[5, 10]} stroke="oklch(0.5 0.03 258)" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12 }} />
              <Legend />
              <Line type="monotone" dataKey="port" name="Português" stroke="oklch(0.5 0.21 264)" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="mat" name="Matemática" stroke="oklch(0.7 0.16 160)" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="cien" name="Ciências" stroke="oklch(0.78 0.16 75)" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <h3 className="mb-1 font-semibold">Ranking de turmas</h3>
          <p className="mb-4 text-xs text-muted-foreground">Média geral por turma</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={turmas}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 250)" />
              <XAxis dataKey="t" stroke="oklch(0.5 0.03 258)" fontSize={12} />
              <YAxis domain={[5, 10]} stroke="oklch(0.5 0.03 258)" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12 }} />
              <Bar dataKey="n" name="Média" fill="oklch(0.5 0.21 264)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}