import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/page-placeholder";
import { FileText } from "lucide-react";
export const Route = createFileRoute("/app/relatorios")({
  component: () => <PagePlaceholder icon={FileText} title="Relatórios" description="Geração automática de relatórios pedagógicos, atas, planos de ação e indicadores." cta="Gerar relatório" />,
});
