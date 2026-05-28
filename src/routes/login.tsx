import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — EduAnalytics IA" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Bem-vindo(a) de volta!");
      navigate({ to: "/app" });
    }, 600);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden lg:block" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, oklch(0.7 0.2 258 / 0.5), transparent 45%), radial-gradient(circle at 80% 70%, oklch(0.6 0.22 280 / 0.4), transparent 50%)" }} />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-bold">EduAnalytics IA</span>
          </Link>
          <div className="max-w-md space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> BI Educacional com IA
            </div>
            <h2 className="font-display text-4xl font-bold leading-tight">Transformando dados escolares em decisões inteligentes.</h2>
            <p className="text-white/75">Acompanhe frequência, desempenho e risco de evasão em tempo real — com análises pedagógicas geradas por IA.</p>
          </div>
          <p className="text-xs text-white/50">© {new Date().getFullYear()} EduAnalytics IA</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">EduAnalytics IA</span>
          </div>
          <h1 className="font-display text-3xl font-bold">Bem-vindo de volta</h1>
          <p className="mt-2 text-sm text-muted-foreground">Acesse o painel da sua escola.</p>
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="diretor@escola.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <a href="#" className="text-xs text-primary hover:underline">Esqueci minha senha</a>
              </div>
              <Input id="password" type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full rounded-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-widest text-muted-foreground">ou</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <Button variant="outline" className="w-full rounded-full" onClick={() => navigate({ to: "/app" })}>
            Continuar com Google
          </Button>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Não tem conta? <Link to="/login" className="font-medium text-primary hover:underline">Criar uma agora</Link>
          </p>
        </div>
      </div>
    </div>
  );
}