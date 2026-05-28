import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  icon: LucideIcon;
  tone?: "default" | "success" | "warning" | "destructive";
}

const toneMap = {
  default: "text-primary bg-primary/10",
  success: "text-success bg-success/10",
  warning: "text-warning bg-warning/10",
  destructive: "text-destructive bg-destructive/10",
};

export function KpiCard({ label, value, delta, trend = "up", icon: Icon, tone = "default" }: KpiCardProps) {
  const TrendIcon = trend === "down" ? ArrowDownRight : ArrowUpRight;
  const trendColor = trend === "down" ? "text-destructive" : "text-success";
  return (
    <div className="rounded-2xl border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${toneMap[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 font-display text-3xl font-bold tracking-tight">{value}</p>
      {delta && (
        <div className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
          <TrendIcon className="h-3.5 w-3.5" />
          {delta}
          <span className="font-normal text-muted-foreground">vs bimestre anterior</span>
        </div>
      )}
    </div>
  );
}