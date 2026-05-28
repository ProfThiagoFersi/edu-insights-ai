import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/page-placeholder";
import { AlertTriangle } from "lucide-react";
export const Route = createFileRoute("/app/risco")({
  component: () => <PagePlaceholder icon={AlertTriangle} title="Alunos em risco" description="Painel exclusivo com nome, motivo, frequência, média e nível de risco." />,
});
