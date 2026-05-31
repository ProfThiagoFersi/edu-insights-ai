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
import { GraduationCap, Plus, Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/app/professores")({ component: Professores });

type Professor = { id: string; nome: string; disciplina: string; turmas: string; email: string; telefone: string };

function Professores() {
  const { user } = useAuth();
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nome: "", disciplina: "", turmas: "", email: "", telefone: "" });

  const load = async () => {
    const { data } = await supabase.from("professores").select("id, nome, disciplina, turmas, email, telefone").order("nome");
    setProfessores((data as Professor[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return professores.filter((p) => p.nome.toLowerCase().includes(q) || p.disciplina.toLowerCase().includes(q));
  }, [professores, query]);

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("professores").insert({ owner_id: user.id, ...form });
    setSaving(false);
    if (error) { toast.error("Erro ao salvar professor."); return; }
    toast.success("Professor cadastrado!");
    setOpen(false);
    setForm({ nome: "", disciplina: "", turmas: "", email: "", telefone: "" });
    void load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Professores</h1>
          <p className="text-sm text-muted-foreground">{professores.length} professor(es) cadastrado(s)</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full"><Plus className="mr-2 h-4 w-4" /> Cadastrar professor</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Cadastrar professor</DialogTitle></DialogHeader>
            <form onSubmit={onSave} className="space-y-4">
              <div className="space-y-2"><Label>Nome</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Disciplina</Label><Input value={form.disciplina} onChange={(e) => setForm({ ...form, disciplina: e.target.value })} placeholder="Matemática" /></div>
                <div className="space-y-2"><Label>Turmas</Label><Input value={form.turmas} onChange={(e) => setForm({ ...form, turmas: e.target.value })} placeholder="7º B, 8º A" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>E-mail</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div className="space-y-2"><Label>Telefone</Label><Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} /></div>
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
          <Input value={query} onChange={(e) => setQuery(e.target.value)} className="rounded-full pl-9" placeholder="Buscar por nome ou disciplina..." />
        </div>
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Carregando professores...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground"><GraduationCap className="h-6 w-6" /></div>
            <p className="text-sm font-medium">Nenhum professor cadastrado</p>
            <p className="text-xs text-muted-foreground">Clique em "Cadastrar professor" para começar.</p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Professor</th>
                  <th className="py-3 pr-4 font-medium">Disciplina</th>
                  <th className="py-3 pr-4 font-medium">Turmas</th>
                  <th className="py-3 pr-4 font-medium">Contato</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 transition-colors hover:bg-muted/40">
                    <td className="py-3 pr-4 font-medium">{p.nome}</td>
                    <td className="py-3 pr-4">{p.disciplina || "—"}</td>
                    <td className="py-3 pr-4">{p.turmas || "—"}</td>
                    <td className="py-3 pr-4"><p>{p.email || "—"}</p><p className="text-xs text-muted-foreground">{p.telefone}</p></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
