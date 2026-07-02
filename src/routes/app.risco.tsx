import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Loader2, Mail, MessageCircle, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ExportDialog } from "@/components/export-dialog";
import { useServerFn } from "@tanstack/react-start";
import { gerarComunicadoResponsavel, gerarParecerAluno } from "@/lib/ia.functions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const Route = createFileRoute("/app/risco")({ component: Risco });

type Aluno = { id: string; nome: string; turma_nome: string; responsavel: string; telefone: string; frequencia: number; media: number; motivo_risco: string };

function nivel(freq: number, media: number): "alto" | "medio" | null {
  if (freq < 75 || media < 6) return "alto";
  if (freq < 90 || media < 7) return "medio";
  return null;
}

function ParecerButton({ aluno, nivelRisco }: { aluno: Aluno; nivelRisco: "alto" | "medio" }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parecer, setParecer] = useState("");
  const gerar = useServerFn(gerarParecerAluno);

  const handleGerar = async () => {
    setLoading(true);
    setParecer("");
    try {
      const res = await gerar({
        data: {
          nome: aluno.nome,
          turma: aluno.turma_nome || "",
          frequencia: Number(aluno.frequencia),
          media: Number(aluno.media),
          nivel: nivelRisco,
          motivo_risco: aluno.motivo_risco || "",
        },
      });
      setParecer(res.content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao gerar parecer.");
    } finally {
      setLoading(false);
    }
  };

  const openAndGenerate = () => {
    setOpen(true);
    if (!parecer && !loading) void handleGerar();
  };

  return (
    <>
      <Button size="sm" variant="secondary" className="rounded-full" onClick={openAndGenerate}>
        <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Parecer IA
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Parecer pedagógico — {aluno.nome}</DialogTitle>
            <DialogDescription>
              Gerado por IA com base em frequência, média e histórico de risco. Revise antes de usar.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[55vh] overflow-y-auto rounded-lg border bg-muted/30 p-4">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Gerando parecer...
              </div>
            ) : parecer ? (
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{parecer}</pre>
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">Nenhum parecer gerado ainda.</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-full"
              disabled={loading}
              onClick={() => {
                if (parecer) navigator.clipboard.writeText(parecer).then(() => toast.success("Parecer copiado!"));
              }}
            >
              Copiar
            </Button>
            <Button className="rounded-full" disabled={loading} onClick={handleGerar}>
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> {parecer ? "Gerar novamente" : "Gerar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ComunicadoButton({ aluno, nivelRisco }: { aluno: Aluno; nivelRisco: "alto" | "medio" }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canal, setCanal] = useState<"email" | "whatsapp">("whatsapp");
  const [texto, setTexto] = useState("");
  const [email, setEmail] = useState("");
  const gerar = useServerFn(gerarComunicadoResponsavel);

  const handleGerar = async () => {
    setLoading(true);
    try {
      const res = await gerar({
        data: {
          nome: aluno.nome,
          turma: aluno.turma_nome || "",
          responsavel: aluno.responsavel || "",
          frequencia: Number(aluno.frequencia),
          media: Number(aluno.media),
          nivel: nivelRisco,
          motivo_risco: aluno.motivo_risco || "",
          canal,
        },
      });
      setTexto(res.content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao gerar comunicado.");
    } finally {
      setLoading(false);
    }
  };

  const enviar = () => {
    if (!texto.trim()) {
      toast.error("Gere ou escreva o comunicado antes de enviar.");
      return;
    }
    if (canal === "whatsapp") {
      if (!aluno.telefone) {
        toast.error("Telefone do responsável não cadastrado.");
        return;
      }
      window.open(
        `https://wa.me/${aluno.telefone.replace(/\D/g, "")}?text=${encodeURIComponent(texto)}`,
        "_blank",
      );
    } else {
      if (!email.trim()) {
        toast.error("Informe o e-mail do responsável.");
        return;
      }
      const assunto = `Acompanhamento pedagógico — ${aluno.nome}`;
      window.open(
        `mailto:${encodeURIComponent(email.trim())}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(texto)}`,
        "_blank",
      );
    }
  };

  return (
    <>
      <Button size="sm" variant="outline" className="rounded-full" onClick={() => setOpen(true)}>
        <Send className="mr-1.5 h-3.5 w-3.5" /> Comunicado
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Comunicado ao responsável — {aluno.nome}</DialogTitle>
            <DialogDescription>
              Gere um texto com IA, revise livremente e envie por WhatsApp ou e-mail.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Canal de envio</Label>
              <RadioGroup
                value={canal}
                onValueChange={(v) => setCanal(v as "email" | "whatsapp")}
                className="flex gap-4 pt-1"
              >
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <RadioGroupItem value="whatsapp" /> WhatsApp
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <RadioGroupItem value="email" /> E-mail
                </label>
              </RadioGroup>
            </div>

            {canal === "email" && (
              <div className="space-y-2">
                <Label>E-mail do responsável</Label>
                <Input
                  type="email"
                  placeholder="responsavel@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Texto do comunicado</Label>
                <Button size="sm" variant="secondary" className="rounded-full" disabled={loading} onClick={handleGerar}>
                  {loading ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Sparkles className="mr-1.5 h-3.5 w-3.5" />}
                  {texto ? "Gerar novamente" : "Gerar com IA"}
                </Button>
              </div>
              <Textarea
                rows={10}
                placeholder="Clique em 'Gerar com IA' ou escreva o comunicado aqui..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" className="rounded-full" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button className="rounded-full" onClick={enviar}>
              {canal === "whatsapp" ? <MessageCircle className="mr-1.5 h-3.5 w-3.5" /> : <Mail className="mr-1.5 h-3.5 w-3.5" />}
              Enviar por {canal === "whatsapp" ? "WhatsApp" : "e-mail"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
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

  const exportColumns = [
    { key: "nome", label: "Aluno" },
    { key: "turma", label: "Turma" },
    { key: "frequencia", label: "Frequência" },
    { key: "media", label: "Média" },
    { key: "nivel", label: "Nível" },
    { key: "responsavel", label: "Responsável" },
    { key: "telefone", label: "Telefone" },
  ];
  const exportData = emRisco.map((a) => ({
    nome: a.nome,
    turma: a.turma_nome || "—",
    frequencia: `${a.frequencia}%`,
    media: Number(a.media).toFixed(1),
    nivel: a.n === "alto" ? "Alto" : "Médio",
    responsavel: a.responsavel || "—",
    telefone: a.telefone || "—",
  }));

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
        <ExportDialog
          title="Relatório — Alunos em Risco"
          filename="alunos-em-risco"
          columns={exportColumns}
          rows={exportData}
          turmaOptions={Array.from(new Set(emRisco.map((a) => a.turma_nome).filter(Boolean)))}
          turmaColumn="turma"
        />
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
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" className="rounded-full" onClick={() => openWhatsApp(a.telefone, a.nome)}>
                        <MessageCircle className="mr-1.5 h-3.5 w-3.5" /> Contatar
                      </Button>
                      <ParecerButton aluno={a} nivelRisco={a.n as "alto" | "medio"} />
                      <ComunicadoButton aluno={a} nivelRisco={a.n as "alto" | "medio"} />
                    </div>
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
