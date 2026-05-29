import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/hooks/use-auth";
import { GraduationCap } from "lucide-react";

export const Route = createFileRoute("/app")({
  head: () => ({ meta: [{ title: "Plataforma — EduAnalytics IA" }] }),
  component: AppGuard,
});

function AppGuard() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/login" });
  }, [loading, session, navigate]);

  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-xl text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
            <GraduationCap className="h-6 w-6" />
          </div>
          <p className="text-sm text-muted-foreground">Carregando sua plataforma...</p>
        </div>
      </div>
    );
  }

  return <AppShell />;
}