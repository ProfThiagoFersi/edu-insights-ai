import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, AlertTriangle, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app/busca-ativa")({ component: BuscaAtiva });

type Aluno = { id: string; nome: string; turma_nome: string; responsavel: string; telefone: string; frequencia: number; media: number; motivo_risco: string };

function motivoOf(a: Aluno): { motivo: string; risco: "alto" | "medio" } | null {
  const freq = Number(a.frequencia);
  const media = Number(a.media);
  if (a.motivo_risco) return { motivo: a.motivo_risco, risco: freq < 75 || media < 6 ? "alto" : "medio" };
  if (freq < 75) return { motivo: `Baixa frequência (${freq}%)`, risco: "alto" };
  if (media < 6) return { motivo: `Média abaixo do esperado (${media.toFixed(1)})`, risco: "alto" };
  if (freq < 90) return { motivo: `Frequência em queda (${freq}%)`, risco: "medio" };
  if (media < 7) return { motivo: `Rendimento em atenção (${media.toFixed(1)})`, risco: "medio" };
  return null;
}

function BuscaAtiva() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("alunos").select("id, nome, turma_nome, responsavel, telefone, frequencia, media, motivo_risco").then(({ data }) => {
      setAlunos((data as Aluno[]) ?? []);
      setLoading(false);
    });
  }, []);

  const casos = useMemo(() =>
    alunos.map((a) => ({ a, info: motivoOf(a) })).filter((c) => c.info).sort((c) => (c.info!.risco === "alto" ? -1 : 1)),
  [alunos]);

  const openWhatsApp = (tel: string, aluno: string) => {
    if (!tel) { toast.error("Telefone não cadastrado."); return; }
    const msg = `Olá, estamos entrando em contato da equipe gestora da escola para acompanhamento pedagógico e frequência do(a) aluno(a) ${aluno}.`;
    window.open(`https://wa.me/${tel.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`, "_blank");
    toast.success("Conversa aberta no WhatsApp", { description: "Ação registrada no histórico do aluno." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Busca ativa</h1>
        <p className="text-sm text-muted-foreground">Alunos identificados automaticamente por baixa frequência, queda de desempenho ou risco de evasão.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Carregando casos...</div>
      ) : casos.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border bg-card py-16 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success"><Search className="h-6 w-6" /></div>
          <p className="text-sm font-medium">Nenhum caso de busca ativa</p>
          <p className="text-xs text-muted-foreground">Cadastre alunos para que a plataforma identifique riscos automaticamente.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {casos.map(({ a, info }) => (
            <div key={a.id} className="rounded-2xl border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${info!.risco === "alto" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{a.nome} <span className="ml-2 text-xs font-normal text-muted-foreground">{a.turma_nome}</span></h3>
                    <p className="text-sm text-muted-foreground">{info!.motivo}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Responsável: {a.responsavel || "—"}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${info!.risco === "alto" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>{info!.risco === "alto" ? "Risco alto" : "Risco médio"}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={() => openWhatsApp(a.telefone, a.nome)} className="rounded-full bg-success text-success-foreground hover:bg-success/90">
                  <MessageCircle className="mr-2 h-4 w-4" /> Entrar em contato via WhatsApp
                </Button>
                <Button variant="outline" className="rounded-full"><Phone className="mr-2 h-4 w-4" /> Registrar tentativa</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}