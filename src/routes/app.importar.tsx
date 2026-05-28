import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/page-placeholder";
import { Upload } from "lucide-react";
export const Route = createFileRoute("/app/importar")({
  component: () => <PagePlaceholder icon={Upload} title="Importar planilhas" description="Upload de Excel/CSV com mapeamento automático de colunas para notas, frequência e avaliações." cta="Enviar planilha" />,
});
