import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/page-placeholder";
import { GraduationCap } from "lucide-react";
export const Route = createFileRoute("/app/professores")({
  component: () => <PagePlaceholder icon={GraduationCap} title="Professores" description="Cadastro, disciplinas, turmas vinculadas e indicadores de rendimento." cta="Cadastrar professor" />,
});
