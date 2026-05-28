import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props { icon: LucideIcon; title: string; description: string; cta?: string }

export function PagePlaceholder({ icon: Icon, title, description, cta }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="rounded-2xl border bg-card p-12 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
          <Icon className="h-7 w-7" />
        </div>
        <h2 className="font-display text-xl font-bold">Em breve</h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">Este módulo está disponível na versão completa. Conecte sua base de dados para começar.</p>
        {cta && <Button className="mt-6 rounded-full">{cta}</Button>}
      </div>
    </div>
  );
}