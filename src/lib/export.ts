// Lightweight client-side export helpers for CSV and PDF (print-to-PDF).

function escapeCsv(value: string | number) {
  const s = String(value ?? "");
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const lines = [headers, ...rows].map((r) => r.map(escapeCsv).join(";"));
  const csv = "\uFEFF" + lines.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportPDF(opts: {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: (string | number)[][];
  theme?: ExportTheme;
}) {
  const { title, subtitle, headers, rows, theme = "claro" } = opts;
  const win = window.open("", "_blank");
  if (!win) return;
  const t = THEMES[theme];
  const date = new Date().toLocaleString("pt-BR");
  const thead = headers.map((h) => `<th>${h}</th>`).join("");
  const tbody = rows
    .map((r) => `<tr>${r.map((c) => `<td>${String(c ?? "")}</td>`).join("")}</tr>`)
    .join("");
  win.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8" />
  <title>${title}</title>
  <style>
    * { font-family: -apple-system, "Segoe UI", Roboto, sans-serif; }
    body { margin: 32px; color: ${t.text}; background: ${t.bg}; }
    h1 { font-size: 20px; margin: 0 0 4px; }
    .sub { color: ${t.muted}; font-size: 12px; margin: 0 0 2px; }
    .brand { color: ${t.brand}; font-weight: 700; font-size: 13px; letter-spacing: .5px; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 16px; }
    th { text-align: left; background: ${t.headBg}; padding: 8px 10px; border-bottom: 2px solid ${t.border}; text-transform: uppercase; font-size: 10px; letter-spacing: .5px; color: ${t.muted}; }
    td { padding: 8px 10px; border-bottom: 1px solid ${t.border}; }
    tr:nth-child(even) td { background: ${t.stripe}; }
    @media print { body { margin: 12px; } }
  </style></head><body>
    <div class="brand">EduAnalytics IA</div>
    <h1>${title}</h1>
    ${subtitle ? `<p class="sub">${subtitle}</p>` : ""}
    <p class="sub">Gerado em ${date}</p>
    <table><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table>
    <script>window.onload = function(){ window.print(); }<\/script>
  </body></html>`);
  win.document.close();
}