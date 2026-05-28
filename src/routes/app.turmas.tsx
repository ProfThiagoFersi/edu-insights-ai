import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/page-placeholder";
import { BookOpen } from "lucide-react";
export const Route = createFileRoute("/app/turmas")({
  component: () => <PagePlaceholder icon={BookOpen} title="Turmas" description="Lista de turmas, média geral, frequência, evolução e comparativos." cta="Nova turma" />,
});
