import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Send, Sparkles, User } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/ia")({ component: IAChat });

type Msg = { role: "user" | "ai"; content: string };

const SUGESTOES = [
  "Quais turmas tiveram queda de desempenho?",
  "Gere análise pedagógica do 7º ano.",
  "Crie plano de ação para baixa frequência.",
  "Resuma os indicadores da escola neste bimestre.",
];

const RESPOSTA_DEMO = `Análise pedagógica — 7º ano

• Frequência média: 89,2% (queda de 4,1 p.p. vs bimestre anterior)
• Disciplinas com maior queda: Matemática (-0,6) e História (-0,4)
• 11 alunos identificados em risco (3 críticos)

Recomendações:
1. Iniciar busca ativa imediata para os 3 alunos críticos.
2. Reforço pedagógico em Matemática (2 encontros/semana por 4 semanas).
3. Reunião com responsáveis dos alunos com frequência abaixo de 75%.
4. Acompanhar evolução semanalmente via dashboard.`;

function IAChat() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "ai", content: RESPOSTA_DEMO }]);
    }, 700);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-4xl flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">IA Pedagógica</h1>
        <p className="text-sm text-muted-foreground">Pergunte sobre indicadores, peça análises ou gere planos de ação.</p>
      </div>

      <div className="flex-1 overflow-y-auto rounded-2xl border bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
        {msgs.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-primary-foreground" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
              <Brain className="h-7 w-7" />
            </div>
            <h2 className="font-display text-xl font-bold">Pergunte para a IA Educacional</h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">Análises pedagógicas, pareceres e relatórios em segundos.</p>
            <div className="mt-6 grid w-full max-w-2xl gap-2 sm:grid-cols-2">
              {SUGESTOES.map((s) => (
                <button key={s} onClick={() => send(s)} className="rounded-xl border bg-background p-3 text-left text-sm transition-colors hover:border-primary hover:bg-accent">
                  <Sparkles className="mb-1 h-3.5 w-3.5 text-primary" />
                  <p>{s}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {msgs.map((m, i) => (
              <div key={i} className="flex gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${m.role === "ai" ? "text-primary-foreground" : "bg-muted"}`} style={m.role === "ai" ? { background: "var(--gradient-primary)" } : {}}>
                  {m.role === "ai" ? <Brain className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                <div className="flex-1 pt-1">
                  <p className="mb-1 text-xs font-semibold">{m.role === "ai" ? "IA Pedagógica" : "Você"}</p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{m.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="mt-4 flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Pergunte alguma coisa..." className="rounded-full" />
        <Button type="submit" size="icon" className="h-10 w-10 rounded-full"><Send className="h-4 w-4" /></Button>
      </form>
    </div>
  );
}