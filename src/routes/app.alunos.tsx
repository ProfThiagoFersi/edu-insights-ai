import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Plus, Loader2, Users } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/app/alunos")({ component: Alunos });

type Aluno = {
  id: string;
  nome: string;
  turma_nome: string;
  responsavel: string;
  telefone: string;
  frequencia: number;
  media: number;
};

function statusOf(freq: number, media: number): "bom" | "atencao" | "risco" {
  if (freq < 75 || media < 6) return "risco";
  if (freq < 90 || media < 7) return "atencao";
  return "bom";
}
const statusStyle = {
  bom: "bg-success/10 text-success",
  atencao: "bg-warning/10 text-warning",
  risco: "bg-destructive/10 text-destructive",
};
const statusLabel = { bom: "Bom desempenho", atencao: "Atenção", risco: "Risco" };

function Alunos() {
  const { user } = useAuth();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nome: "", turma_nome: "", responsavel: "", telefone: "", frequencia: "100", media: "0" });

  const load = async () => {
    const { data } = await supabase.from("alunos").select("id, nome, turma_nome, responsavel, telefone, frequencia, media").order("nome");
    setAlunos((data as Aluno[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return alunos.filter((a) => a.nome.toLowerCase().includes(q) || a.responsavel.toLowerCase().includes(q) || a.turma_nome.toLowerCase().includes(q));
  }, [alunos, query]);

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("alunos").insert({
      owner_id: user.id,
      nome: form.nome,
      turma_nome: form.turma_nome,
      responsavel: form.responsavel,
      telefone: form.telefone,
      frequencia: Number(form.frequencia) || 0,
      media: Number(form.media) || 0,
    });
    setSaving(false);
    if (error) { toast.error("Erro ao salvar aluno."); return; }
    toast.success("Aluno cadastrado!");
    setOpen(false);
    setForm({ nome: "", turma_nome: "", responsavel: "", telefone: "", frequencia: "100", media: "0" });
    void load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Alunos</h1>
          <p className="text-sm text-muted-foreground">{alunos.length} aluno(s) matriculado(s)</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full"><Plus className="mr-2 h-4 w-4" /> Novo aluno</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Cadastrar aluno</DialogTitle></DialogHeader>
            <form onSubmit={onSave} className="space-y-4">
              <div className="space-y-2"><Label>Nome</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Turma</Label><Input value={form.turma_nome} onChange={(e) => setForm({ ...form, turma_nome: e.target.value })} placeholder="7º B" /></div>
                <div className="space-y-2"><Label>Responsável</Label><Input value={form.responsavel} onChange={(e) => setForm({ ...form, responsavel: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2"><Label>Telefone</Label><Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} /></div>
                <div className="space-y-2"><Label>Frequência %</Label><Input type="number" value={form.frequencia} onChange={(e) => setForm({ ...form, frequencia: e.target.value })} /></div>
                <div className="space-y-2"><Label>Média</Label><Input type="number" step="0.1" value={form.media} onChange={(e) => setForm({ ...form, media: e.target.value })} /></div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={saving} className="rounded-full">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-2xl border bg-card p-4" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} className="rounded-full pl-9" placeholder="Buscar por nome, turma ou responsável..." />
        </div>
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Carregando alunos...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground"><Users className="h-6 w-6" /></div>
            <p className="text-sm font-medium">Nenhum aluno cadastrado</p>
            <p className="text-xs text-muted-foreground">Clique em "Novo aluno" para começar.</p>
          </div>
        ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Aluno</th>
                <th className="py-3 pr-4 font-medium">Turma</th>
                <th className="py-3 pr-4 font-medium">Responsável</th>
                <th className="py-3 pr-4 font-medium">Frequência</th>
                <th className="py-3 pr-4 font-medium">Média</th>
                <th className="py-3 pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const st = statusOf(a.frequencia, a.media);
                return (
                <tr key={a.id} className="border-b last:border-0 transition-colors hover:bg-muted/40">
                  <td className="py-3 pr-4"><p className="font-medium">{a.nome}</p></td>
                  <td className="py-3 pr-4">{a.turma_nome || "—"}</td>
                  <td className="py-3 pr-4">
                    <p>{a.responsavel || "—"}</p>
                    <p className="text-xs text-muted-foreground">{a.telefone}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 rounded-full bg-muted">
                        <div className="h-full rounded-full" style={{ width: `${a.frequencia}%`, background: a.frequencia < 75 ? "oklch(0.62 0.22 25)" : a.frequencia < 90 ? "oklch(0.78 0.16 75)" : "oklch(0.7 0.16 160)" }} />
                      </div>
                      <span className="text-xs font-medium">{a.frequencia}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-semibold">{Number(a.media).toFixed(1)}</td>
                  <td className="py-3 pr-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[st]}`}>{statusLabel[st]}</span>
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
}