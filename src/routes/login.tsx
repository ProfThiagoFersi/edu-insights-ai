import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap, Sparkles } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — EduAnalytics IA" }] }),
  component: LoginPage,
});

const CARGOS = [
  { value: "diretor", label: "Diretor(a)" },
  { value: "vice_diretor", label: "Vice-diretor(a)" },
  { value: "coordenador", label: "Coordenador(a) Pedagógico(a)" },
  { value: "supervisor", label: "Supervisor(a)" },
];

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [escolaNome, setEscolaNome] = useState("");
  const [cargo, setCargo] = useState("coordenador");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/app" });
    });
  }, [navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/app",
            data: { nome, escola_nome: escolaNome, cargo },
          },
        });
        if (error) throw error;
        toast.success("Conta criada!", { description: "Verifique seu e-mail para confirmar o acesso." });
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo(a) de volta!");
        navigate({ to: "/app" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao autenticar";
      toast.error(msg.includes("Invalid login") ? "E-mail ou senha incorretos." : msg);
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/app",
    });
    if (result.error) {
      toast.error("Não foi possível entrar com Google.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/app" });
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
          <h1 className="font-display text-3xl font-bold">
            {mode === "login" ? "Bem-vindo de volta" : "Criar sua conta"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login" ? "Acesse o painel da sua escola." : "Comece a gerir sua escola com IA."}
          </p>
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            {mode === "signup" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Maria Silva" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="escola">Nome da escola</Label>
                  <Input id="escola" value={escolaNome} onChange={(e) => setEscolaNome(e.target.value)} placeholder="EMEF Vila Nova" required />
                </div>
                <div className="space-y-2">
                  <Label>Cargo</Label>
                  <Select value={cargo} onValueChange={setCargo}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CARGOS.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="diretor@escola.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" minLength={6} required />
            </div>
            <Button type="submit" className="w-full rounded-full" disabled={loading}>
              {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
            </Button>
          </form>
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-widest text-muted-foreground">ou</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <Button variant="outline" className="w-full rounded-full" onClick={onGoogle} type="button">
            Continuar com Google
          </Button>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "Não tem conta? " : "Já tem conta? "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="font-medium text-primary hover:underline"
            >
              {mode === "login" ? "Criar uma agora" : "Entrar"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}