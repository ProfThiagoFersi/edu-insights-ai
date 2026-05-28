import { Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Search,
  Brain,
  FileText,
  Bell,
  AlertTriangle,
  Upload,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const NAV = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/alunos", label: "Alunos", icon: Users },
  { to: "/app/professores", label: "Professores", icon: GraduationCap },
  { to: "/app/turmas", label: "Turmas", icon: BookOpen },
  { to: "/app/busca-ativa", label: "Busca Ativa", icon: Search },
  { to: "/app/ia", label: "IA Pedagógica", icon: Brain },
  { to: "/app/relatorios", label: "Relatórios", icon: FileText },
  { to: "/app/alertas", label: "Alertas", icon: Bell },
  { to: "/app/risco", label: "Alunos em Risco", icon: AlertTriangle },
  { to: "/app/importar", label: "Importar Planilhas", icon: Upload },
  { to: "/app/configuracoes", label: "Configurações", icon: Settings },
] as const;

export function AppShell() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-muted/30">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
          <Link to="/app" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-sm font-bold tracking-tight">EduAnalytics IA</span>
          </Link>
          <button onClick={() => setOpen(false)} className="rounded-md p-1 text-sidebar-foreground/60 hover:bg-sidebar-accent lg:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex flex-col gap-0.5 p-3">
          {NAV.map((item) => {
            const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary" />}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-3 right-3 rounded-xl border border-sidebar-border/60 bg-sidebar-accent/40 p-4">
          <p className="text-xs font-semibold">Plano Profissional</p>
          <p className="mt-1 text-xs text-sidebar-foreground/60">Renovação em 23/12</p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
          <button onClick={() => setOpen(true)} className="rounded-md p-2 hover:bg-muted lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar aluno, turma ou indicador..." className="rounded-full pl-9" />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="relative rounded-full p-2 hover:bg-muted">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full" style={{ background: "var(--gradient-primary)" }} />
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold leading-tight">Diretor(a)</p>
                <p className="text-xs text-muted-foreground">EMEF Vila Nova</p>
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-black/40 lg:hidden" />}
    </div>
  );
}