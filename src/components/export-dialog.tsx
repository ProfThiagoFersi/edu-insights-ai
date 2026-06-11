import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { downloadCSV, exportPDF, type ExportTheme } from "@/lib/export";

export type ExportColumn = { key: string; label: string };
export type ExportRow = Record<string, string | number>;

const PERIODS = [
  "Todos os dados",
  "1º Bimestre",
  "2º Bimestre",
  "3º Bimestre",
  "4º Bimestre",
  "Personalizado",
] as const;

export function ExportDialog({
  title,
  filename,
  columns,
  rows,
  triggerLabel = "Exportar",
}: {
  title: string;
  filename: string;
  columns: ExportColumn[];
  rows: ExportRow[];
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(columns.map((c) => c.key));
  const [format, setFormat] = useState<"pdf" | "csv">("pdf");
  const [theme, setTheme] = useState<ExportTheme>("claro");
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("Todos os dados");
  const [customPeriod, setCustomPeriod] = useState("");

  const toggle = (key: string) =>
    setSelected((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]));

  const periodLabel = period === "Personalizado" ? customPeriod.trim() || "Personalizado" : period;

  const handleExport = () => {
    if (!rows.length) {
      toast.error("Nenhum dado para exportar.");
      return;
    }
    const cols = columns.filter((c) => selected.includes(c.key));
    if (!cols.length) {
      toast.error("Selecione ao menos uma coluna.");
      return;
    }
    const headers = cols.map((c) => c.label);
    const dataRows = rows.map((r) => cols.map((c) => r[c.key] ?? "—"));
    const subtitle = `Período: ${periodLabel} · ${rows.length} registro(s)`;

    if (format === "csv") {
      downloadCSV(filename, headers, dataRows);
    } else {
      exportPDF({ title, subtitle, headers, rows: dataRows, theme });
    }
    toast.success(`${format.toUpperCase()} exportado!`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full">
          <Download className="mr-2 h-4 w-4" /> {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Opções de exportação</DialogTitle>
          <DialogDescription>Escolha colunas, período e tema antes de gerar o arquivo.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Colunas</Label>
            <div className="grid grid-cols-2 gap-2">
              {columns.map((c) => (
                <label key={c.key} className="flex cursor-pointer items-center gap-2 rounded-lg border p-2 text-sm">
                  <Checkbox checked={selected.includes(c.key)} onCheckedChange={() => toggle(c.key)} />
                  {c.label}
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Período</Label>
              <Select value={period} onValueChange={(v) => setPeriod(v as (typeof PERIODS)[number])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PERIODS.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {period === "Personalizado" && (
                <Input
                  placeholder="Ex.: Jan–Mar 2026"
                  value={customPeriod}
                  onChange={(e) => setCustomPeriod(e.target.value)}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label>Formato</Label>
              <RadioGroup value={format} onValueChange={(v) => setFormat(v as "pdf" | "csv")} className="flex gap-4 pt-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <RadioGroupItem value="pdf" /> PDF
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <RadioGroupItem value="csv" /> CSV
                </label>
              </RadioGroup>
            </div>
          </div>

          {format === "pdf" && (
            <div className="space-y-2">
              <Label>Tema do PDF</Label>
              <RadioGroup value={theme} onValueChange={(v) => setTheme(v as ExportTheme)} className="flex gap-4 pt-1">
                <label className="flex cursor-pointer items-center gap-2 text-sm"><RadioGroupItem value="claro" /> Claro</label>
                <label className="flex cursor-pointer items-center gap-2 text-sm"><RadioGroupItem value="escuro" /> Escuro</label>
                <label className="flex cursor-pointer items-center gap-2 text-sm"><RadioGroupItem value="marca" /> Marca</label>
              </RadioGroup>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" className="rounded-full" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button className="rounded-full" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Exportar {format.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}