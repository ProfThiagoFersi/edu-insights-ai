import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Loader2, MessageCircle, FileDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { downloadCSV, exportPDF } from "@/lib/export";

export const Route = createFileRoute("/app/risco")({ component: Risco });

type Aluno = { id: string; nome: string; turma_nome: string; responsavel: string; telefone: string; frequencia: number; media: number; motivo_risco: string };

function nivel(freq: number, media: number): "alto" | "medio" | null {
  if (freq < 75 || media < 6) return "alto";
  if (freq < 90 || media < 7) return "medio";
  return null;
}

function Risco() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("alunos").select("id, nome, turma_nome, responsavel, telefone, frequencia, media, motivo_risco").then(({ data }) => {
      setAlunos((data as Aluno[]) ?? []);
      setLoading(false);
    });
  }, []);

  const emRisco = useMemo(() =>
    alunos.map((a) => ({ ...a, n: nivel(Number(a.frequencia), Number(a.media)) }))
      .filter((a) => a.n)
      .sort((a) => (a.n === "alto" ? -1 : 1)),
  [alunos]);

  const altos = emRisco.filter((a) => a.n === "alto").length;

  const exportRows = () =>
    emRisco.map((a) => [
      a.nome,
      a.turma_nome || "—",
      `${a.frequencia}%`,
      Number(a.media).toFixed(1),
      a.n === "alto" ? "Alto" : "Médio",
      a.responsavel || "—",
      a.telefone || "—",
    ]);
  const exportHeaders = ["Aluno", "Turma", "Frequência", "Média", "Nível", "Responsável", "Telefone"];

  const onCSV = () => {
    if (!emRisco.length) { toast.error("Nenhum aluno em risco para exportar."); return; }
    downloadCSV("alunos-em-risco", exportHeaders, exportRows());
    toast.success("CSV exportado!");
  };
  const onPDF = () => {
    if (!emRisco.length) { toast.error("Nenhum aluno em risco para exportar."); return; }
    exportPDF({
      title: "Relatório — Alunos em Risco",
      subtitle: `${emRisco.length} aluno(s) · ${altos} risco alto · ${emRisco.length - altos} risco médio`,
      headers: exportHeaders,
      rows: exportRows(),
    });
  };

  const openWhatsApp = (tel: string, aluno: string) => {
    if (!tel) { toast.error("Telefone não cadastrado."); return; }
    const msg = `Olá, somos da equipe gestora da escola e gostaríamos de conversar sobre o acompanhamento pedagógico do(a) aluno(a) ${aluno}.`;
    window.open(`https://wa.me/${tel.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Alunos em risco</h1>
          <p className="text-sm text-muted-foreground">Identificados automaticamente por baixa frequência ou média abaixo do esperado.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full" onClick={onCSV}><FileDown className="mr-2 h-4 w-4" /> CSV</Button>
          <Button className="rounded-full" onClick={onPDF}><FileText className="mr-2 h-4 w-4" /> PDF</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Total em risco</p>
          <p className="mt-2 font-display text-3xl font-bold">{emRisco.length}</p>
        </div>
        <div className="rounded-2xl border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Risco alto</p>
          <p className="mt-2 font-display text-3xl font-bold text-destructive">{altos}</p>
        </div>
        <div className="rounded-2xl border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Risco médio</p>
          <p className="mt-2 font-display text-3xl font-bold text-warning">{emRisco.length - altos}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Carregando...</div>
      ) : emRisco.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border bg-card py-16 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success"><AlertTriangle className="h-6 w-6" /></div>
          <p className="text-sm font-medium">Nenhum aluno em risco</p>
          <p className="text-xs text-muted-foreground">Todos os alunos estão dentro dos parâmetros adequados.</p>
        </div>
      ) : (
        <div className="rounded-2xl border bg-card p-4 overflow-x-auto" style={{ boxShadow: "var(--shadow-card)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Aluno</th>
                <th className="py-3 pr-4 font-medium">Turma</th>
                <th className="py-3 pr-4 font-medium">Frequência</th>
                <th className="py-3 pr-4 font-medium">Média</th>
                <th className="py-3 pr-4 font-medium">Nível</th>
                <th className="py-3 pr-4 font-medium">Ação</th>
              </tr>
            </thead>
            <tbody>
              {emRisco.map((a) => (
                <tr key={a.id} className="border-b last:border-0 transition-colors hover:bg-muted/40">
                  <td className="py-3 pr-4"><p className="font-medium">{a.nome}</p><p className="text-xs text-muted-foreground">{a.responsavel}</p></td>
                  <td className="py-3 pr-4">{a.turma_nome || "—"}</td>
                  <td className="py-3 pr-4">{a.frequencia}%</td>
                  <td className="py-3 pr-4 font-semibold">{Number(a.media).toFixed(1)}</td>
                  <td className="py-3 pr-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${a.n === "alto" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>{a.n === "alto" ? "Alto" : "Médio"}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <Button size="sm" variant="outline" className="rounded-full" onClick={() => openWhatsApp(a.telefone, a.nome)}>
                      <MessageCircle className="mr-1.5 h-3.5 w-3.5" /> Contatar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
