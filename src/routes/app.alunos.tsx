import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

export const Route = createFileRoute("/app/alunos")({ component: Alunos });

const ALUNOS = [
  { ra: "20231001", nome: "Ana Beatriz Souza", turma: "7º B", resp: "Carla Souza", tel: "(11) 99999-0001", freq: 72, media: 5.8, status: "risco" as const },
  { ra: "20231002", nome: "Bruno Oliveira", turma: "8º A", resp: "Marcos Oliveira", tel: "(11) 99999-0002", freq: 88, media: 7.1, status: "atencao" as const },
  { ra: "20231003", nome: "Camila Pereira", turma: "9º A", resp: "Elaine Pereira", tel: "(11) 99999-0003", freq: 96, media: 8.7, status: "bom" as const },
  { ra: "20231004", nome: "Diego Martins", turma: "6º A", resp: "Patrícia Martins", tel: "(11) 99999-0004", freq: 98, media: 9.1, status: "bom" as const },
  { ra: "20231005", nome: "Eduarda Lima", turma: "7º A", resp: "Roberto Lima", tel: "(11) 99999-0005", freq: 81, media: 6.5, status: "atencao" as const },
  { ra: "20231006", nome: "Felipe Almeida", turma: "8º B", resp: "Sandra Almeida", tel: "(11) 99999-0006", freq: 65, media: 5.2, status: "risco" as const },
];

const statusStyle = {
  bom: "bg-success/10 text-success",
  atencao: "bg-warning/10 text-warning",
  risco: "bg-destructive/10 text-destructive",
};
const statusLabel = { bom: "Bom desempenho", atencao: "Atenção", risco: "Risco" };

function Alunos() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Alunos</h1>
          <p className="text-sm text-muted-foreground">1.284 alunos matriculados</p>
        </div>
        <Button className="rounded-full"><Plus className="mr-2 h-4 w-4" /> Novo aluno</Button>
      </div>

      <div className="rounded-2xl border bg-card p-4" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="rounded-full pl-9" placeholder="Buscar por nome, RA ou responsável..." />
        </div>
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
              {ALUNOS.map((a) => (
                <tr key={a.ra} className="border-b last:border-0 transition-colors hover:bg-muted/40">
                  <td className="py-3 pr-4">
                    <p className="font-medium">{a.nome}</p>
                    <p className="text-xs text-muted-foreground">RA {a.ra}</p>
                  </td>
                  <td className="py-3 pr-4">{a.turma}</td>
                  <td className="py-3 pr-4">
                    <p>{a.resp}</p>
                    <p className="text-xs text-muted-foreground">{a.tel}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 rounded-full bg-muted">
                        <div className="h-full rounded-full" style={{ width: `${a.freq}%`, background: a.freq < 75 ? "oklch(0.62 0.22 25)" : a.freq < 90 ? "oklch(0.78 0.16 75)" : "oklch(0.7 0.16 160)" }} />
                      </div>
                      <span className="text-xs font-medium">{a.freq}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-semibold">{a.media.toFixed(1)}</td>
                  <td className="py-3 pr-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[a.status]}`}>{statusLabel[a.status]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}