import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/page-placeholder";
import { Bell } from "lucide-react";
export const Route = createFileRoute("/app/alertas")({
  component: () => <PagePlaceholder icon={Bell} title="Central de alertas" description="Notificações inteligentes em tempo real, priorizadas por criticidade." />,
});
