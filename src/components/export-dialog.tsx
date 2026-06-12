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
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Eye } from "lucide-react";
import { toast } from "sonner";
import { downloadCSV, exportPDF, buildCSV, THEMES, type ExportTheme } from "@/lib/export";

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
  turmaOptions,
  turmaColumn,
  triggerLabel = "Exportar",
}: {
  title: string;
  filename: string;
  columns: ExportColumn[];
  rows: ExportRow[];
  turmaOptions?: string[];
  turmaColumn?: string;
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(columns.map((c) => c.key));
  const [format, setFormat] = useState<"pdf" | "csv">("pdf");
  const [theme, setTheme] = useState<ExportTheme>("claro");
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("Todos os dados");
  const [customPeriod, setCustomPeriod] = useState("");
  const [selectedTurmas, setSelectedTurmas] = useState<string[]>([]);

  const toggle = (key: string) =>
    setSelected((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]));

  const toggleTurma = (nome: string) =>
    setSelectedTurmas((s) =>
      s.includes(nome) ? s.filter((n) => n !== nome) : [...s, nome]
    );

  const allTurmasSelected = turmaOptions && turmaOptions.length > 0 && selectedTurmas.length === turmaOptions.length;

  const handleSelectAllTurmas = () => {
    if (!turmaOptions) return;
    if (allTurmasSelected) {
      setSelectedTurmas([]);
    } else {
      setSelectedTurmas([...turmaOptions]);
    }
  };

  const periodLabel = period === "Personalizado" ? customPeriod.trim() || "Personalizado" : period;

  const cols = columns.filter((c) => selected.includes(c.key));
  let previewRows = rows;
  if (turmaColumn && selectedTurmas.length > 0) {
    previewRows = rows.filter((r) => selectedTurmas.includes(String(r[turmaColumn])));
  }
  const previewHeaders = cols.map((c) => c.label);
  const previewData = previewRows.map((r) => cols.map((c) => r[c.key] ?? "—"));
  const previewSubtitle = `Período: ${periodLabel} · ${previewRows.length} registro(s)`;
  const PREVIEW_LIMIT = 8;
  const t = THEMES[theme];

  const handleExport = () => {
    if (!rows.length) {
      toast.error("Nenhum dado para exportar.");
      return;
    }
    if (!cols.length) {
      toast.error("Selecione ao menos uma coluna.");
      return;
    }
    const filteredRows = previewRows;
    if (!filteredRows.length) {
      toast.error("Nenhum registro corresponde aos filtros selecionados.");
      return;
    }
    const headers = previewHeaders;
    const dataRows = previewData;
    const subtitle = previewSubtitle;

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
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Opções de exportação</DialogTitle>
          <DialogDescription>Escolha colunas, turmas, período e tema antes de gerar o arquivo.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-3">
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

          {turmaOptions && turmaOptions.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Turmas</Label>
                <button
                  type="button"
                  onClick={handleSelectAllTurmas}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  {allTurmasSelected ? "Desmarcar todas" : "Selecionar todas"}
                </button>
              </div>
              <ScrollArea className="h-40 rounded-lg border p-2">
                <div className="grid grid-cols-2 gap-2">
                  {turmaOptions.map((nome) => (
                    <label key={nome} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/60">
                      <Checkbox checked={selectedTurmas.includes(nome)} onCheckedChange={() => toggleTurma(nome)} />
                      {nome}
                    </label>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

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

          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Eye className="h-4 w-4" /> Pré-visualização</Label>
            {!cols.length ? (
              <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                Selecione ao menos uma coluna para ver a pré-visualização.
              </p>
            ) : !previewRows.length ? (
              <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                Nenhum registro corresponde aos filtros selecionados.
              </p>
            ) : format === "csv" ? (
              <pre className="max-h-56 overflow-auto rounded-lg border bg-muted/40 p-3 text-xs leading-relaxed">
{buildCSV(previewHeaders, previewData.slice(0, PREVIEW_LIMIT).map((r) => r.map((c) => String(c))))}
{previewData.length > PREVIEW_LIMIT ? `\n… +${previewData.length - PREVIEW_LIMIT} linha(s)` : ""}
              </pre>
            ) : (
              <div className="overflow-hidden rounded-lg border" style={{ background: t.bg, color: t.text, borderColor: t.border }}>
                <div className="px-4 pt-3" style={{ color: t.brand, fontWeight: 700, fontSize: 11, letterSpacing: ".5px" }}>EduAnalytics IA</div>
                <div className="px-4" style={{ fontSize: 14, fontWeight: 700 }}>{title}</div>
                <div className="px-4 pb-2" style={{ color: t.muted, fontSize: 10 }}>{previewSubtitle}</div>
                <div className="max-h-56 overflow-auto">
                  <table className="w-full" style={{ borderCollapse: "collapse", fontSize: 11 }}>
                    <thead>
                      <tr>
                        {previewHeaders.map((h) => (
                          <th key={h} style={{ textAlign: "left", background: t.headBg, color: t.muted, padding: "6px 10px", borderBottom: `2px solid ${t.border}`, textTransform: "uppercase", fontSize: 9, letterSpacing: ".5px" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.slice(0, PREVIEW_LIMIT).map((r, i) => (
                        <tr key={i} style={{ background: i % 2 ? t.stripe : t.bg }}>
                          {r.map((c, j) => (
                            <td key={j} style={{ padding: "6px 10px", borderBottom: `1px solid ${t.border}` }}>{String(c ?? "")}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {previewData.length > PREVIEW_LIMIT && (
                  <div className="px-4 py-2" style={{ color: t.muted, fontSize: 10 }}>… +{previewData.length - PREVIEW_LIMIT} linha(s) no arquivo final</div>
                )}
              </div>
            )}
          </div>
        </div>
        </ScrollArea>

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
