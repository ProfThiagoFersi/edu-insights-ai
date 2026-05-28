import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/app")({
  head: () => ({ meta: [{ title: "Plataforma — EduAnalytics IA" }] }),
  component: AppShell,
});