import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/page-placeholder";
import { Settings } from "lucide-react";
export const Route = createFileRoute("/app/configuracoes")({
  component: () => <PagePlaceholder icon={Settings} title="Configurações" description="Dados da escola, logotipo, tema, IA, usuários e segurança." />,
});
