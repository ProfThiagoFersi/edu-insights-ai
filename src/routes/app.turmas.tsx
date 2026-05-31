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
import { BookOpen, Plus, Loader2, Users } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/app/turmas")({ component: Turmas });

type Turma = { id: string; nome: string; serie: string; turno: string };
type Aluno = { turma_nome: string; frequencia: number; media: number };

function Turmas() {
  const { user } = useAuth();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nome: "", serie: "", turno: "Manhã" });

  const load = async () => {
    const [{ data: t }, { data: a }] = await Promise.all([
      supabase.from("turmas").select("id, nome, serie, turno").order("nome"),
      supabase.from("alunos").select("turma_nome, frequencia, media"),
    ]);
    setTurmas((t as Turma[]) ?? []);
    setAlunos((a as Aluno[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const statsFor = (nome: string) => {
    const list = alunos.filter((a) => a.turma_nome === nome);
    if (!list.length) return { count: 0, freq: 0, media: 0 };
    const freq = list.reduce((s, a) => s + Number(a.frequencia), 0) / list.length;
    const media = list.reduce((s, a) => s + Number(a.media), 0) / list.length;
    return { count: list.length, freq: Math.round(freq), media: media.toFixed(1) };
  };

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("turmas").insert({
      owner_id: user.id,
      nome: form.nome,
      serie: form.serie,
      turno: form.turno,
    });
    setSaving(false);
    if (error) { toast.error("Erro ao salvar turma."); return; }
    toast.success("Turma cadastrada!");
    setOpen(false);
    setForm({ nome: "", serie: "", turno: "Manhã" });
    void load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Turmas</h1>
          <p className="text-sm text-muted-foreground">{turmas.length} turma(s) cadastrada(s)</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full"><Plus className="mr-2 h-4 w-4" /> Nova turma</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Cadastrar turma</DialogTitle></DialogHeader>
            <form onSubmit={onSave} className="space-y-4">
              <div className="space-y-2"><Label>Nome</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="7º B" required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Série</Label><Input value={form.serie} onChange={(e) => setForm({ ...form, serie: e.target.value })} placeholder="7º ano" /></div>
                <div className="space-y-2"><Label>Turno</Label><Input value={form.turno} onChange={(e) => setForm({ ...form, turno: e.target.value })} /></div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={saving} className="rounded-full">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Carregando turmas...</div>
      ) : turmas.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border bg-card py-16 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground"><BookOpen className="h-6 w-6" /></div>
          <p className="text-sm font-medium">Nenhuma turma cadastrada</p>
          <p className="text-xs text-muted-foreground">Clique em "Nova turma" para começar.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {turmas.map((t) => {
            const s = statsFor(t.nome);
            return (
              <div key={t.id} className="rounded-2xl border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{t.turno}</span>
                </div>
                <h3 className="mt-3 font-semibold">{t.nome}</h3>
                <p className="text-xs text-muted-foreground">{t.serie || "—"}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div><p className="font-display text-lg font-bold">{s.count}</p><p className="text-[10px] uppercase tracking-wider text-muted-foreground"><Users className="mx-auto mb-0.5 h-3 w-3" />Alunos</p></div>
                  <div><p className="font-display text-lg font-bold">{s.freq}%</p><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Freq.</p></div>
                  <div><p className="font-display text-lg font-bold">{s.media}</p><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Média</p></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
