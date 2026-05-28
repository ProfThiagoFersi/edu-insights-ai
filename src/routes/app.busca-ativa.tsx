import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Calendar, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/busca-ativa")({ component: BuscaAtiva });

const CASOS = [
  { id: 1, aluno: "Ana Beatriz Souza", turma: "7º B", motivo: "12 faltas consecutivas", resp: "Carla Souza", tel: "5511999990001", status: "Em acompanhamento", risco: "alto" },
  { id: 2, aluno: "Felipe Almeida", turma: "8º B", motivo: "Queda de 30% no rendimento", resp: "Sandra Almeida", tel: "5511999990006", status: "Não localizado", risco: "alto" },
  { id: 3, aluno: "Lucas Ribeiro", turma: "6º A", motivo: "Baixa frequência (68%)", resp: "Helena Ribeiro", tel: "5511999990010", status: "Contato realizado", risco: "medio" },
];

const statusTone: Record<string, string> = {
  "Em acompanhamento": "bg-warning/10 text-warning",
  "Contato realizado": "bg-primary/10 text-primary",
  "Não localizado": "bg-destructive/10 text-destructive",
  "Caso resolvido": "bg-success/10 text-success",
};

function BuscaAtiva() {
  const openWhatsApp = (tel: string, aluno: string) => {
    const msg = `Olá, estamos entrando em contato da equipe gestora da escola para acompanhamento pedagógico e frequência do(a) aluno(a) ${aluno}.`;
    window.open(`https://wa.me/${tel}?text=${encodeURIComponent(msg)}`, "_blank");
    toast.success("Conversa aberta no WhatsApp", { description: "Ação registrada no histórico do aluno." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Busca ativa</h1>
        <p className="text-sm text-muted-foreground">Alunos identificados automaticamente pela IA por baixa frequência, queda de desempenho ou risco de evasão.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { l: "Em acompanhamento", v: "14", t: "warning" },
          { l: "Contato realizado", v: "27", t: "primary" },
          { l: "Casos resolvidos no mês", v: "9", t: "success" },
        ].map((c) => (
          <div key={c.l} className="rounded-2xl border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.l}</p>
            <p className={`mt-2 font-display text-3xl font-bold text-${c.t}`}>{c.v}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {CASOS.map((c) => (
          <div key={c.id} className="rounded-2xl border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.risco === "alto" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{c.aluno} <span className="ml-2 text-xs font-normal text-muted-foreground">{c.turma}</span></h3>
                  <p className="text-sm text-muted-foreground">{c.motivo}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Responsável: {c.resp}</p>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusTone[c.status]}`}>{c.status}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => openWhatsApp(c.tel, c.aluno)} className="rounded-full bg-success text-success-foreground hover:bg-success/90">
                <MessageCircle className="mr-2 h-4 w-4" /> Entrar em contato via WhatsApp
              </Button>
              <Button variant="outline" className="rounded-full"><Phone className="mr-2 h-4 w-4" /> Registrar tentativa</Button>
              <Button variant="outline" className="rounded-full"><Calendar className="mr-2 h-4 w-4" /> Agendar retorno</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}