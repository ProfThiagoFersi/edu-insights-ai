import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ShieldCheck,
  Users,
  School,
  GraduationCap,
  BookOpen,
  AlertTriangle,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  getMyRoles,
  getPlatformStats,
  listUsers,
  setUserRole,
  removeUser,
} from "@/lib/admin.functions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/app/admin")({
  head: () => ({ meta: [{ title: "Super Admin — EduAnalytics IA" }] }),
  component: AdminPage,
});

const ROLE_OPTIONS = [
  { value: "diretor", label: "Diretor" },
  { value: "vice_diretor", label: "Vice-diretor" },
  { value: "coordenador", label: "Coordenador" },
  { value: "supervisor", label: "Supervisor" },
  { value: "super_admin", label: "Super Admin" },
];

const ROLE_LABEL: Record<string, string> = Object.fromEntries(
  ROLE_OPTIONS.map((r) => [r.value, r.label]),
);

function AdminPage() {
  const fetchRoles = useServerFn(getMyRoles);
  const { data: me, isLoading: loadingMe } = useQuery({
    queryKey: ["my-roles"],
    queryFn: () => fetchRoles(),
  });

  if (loadingMe) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!me?.isSuperAdmin) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
        <ShieldCheck className="mx-auto h-10 w-10 text-muted-foreground" />
        <h1 className="mt-4 font-display text-lg font-bold">Acesso restrito</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Esta área é exclusiva para superadministradores da plataforma.
        </p>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const fetchStats = useServerFn(getPlatformStats);
  const fetchUsers = useServerFn(listUsers);
  const mutateRole = useServerFn(setUserRole);
  const deleteUser = useServerFn(removeUser);
  const qc = useQueryClient();

  const { data: stats } = useQuery({ queryKey: ["platform-stats"], queryFn: () => fetchStats() });
  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => fetchUsers(),
  });

  const roleMutation = useMutation({
    mutationFn: (vars: { userId: string; role: string; action: "add" | "remove" }) =>
      mutateRole({ data: vars as never }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Papéis atualizados");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeMutation = useMutation({
    mutationFn: (userId: string) => deleteUser({ data: { userId } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["platform-stats"] });
      toast.success("Usuário removido");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const cards = [
    { label: "Usuários", value: stats?.usuarios, icon: Users },
    { label: "Escolas", value: stats?.escolas, icon: School },
    { label: "Alunos", value: stats?.alunos, icon: GraduationCap },
    { label: "Professores", value: stats?.professores, icon: Users },
    { label: "Turmas", value: stats?.turmas, icon: BookOpen },
    { label: "Alunos em risco", value: stats?.alunosEmRisco, icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight">Super Administrador</h1>
          <p className="text-sm text-muted-foreground">Visão global e gestão de usuários da plataforma</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label} className="p-4">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <p className="mt-3 text-2xl font-bold tabular-nums">{c.value ?? "—"}</p>
              <p className="text-xs text-muted-foreground">{c.label}</p>
            </Card>
          );
        })}
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-border p-4">
          <h2 className="font-display text-sm font-bold">Usuários da plataforma</h2>
          <p className="text-xs text-muted-foreground">Atribua papéis ou remova contas</p>
        </div>
        {loadingUsers ? (
          <div className="flex items-center justify-center p-10">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Escola</TableHead>
                  <TableHead>Papéis</TableHead>
                  <TableHead>Adicionar papel</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(usersData?.users ?? []).map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.nome || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{u.escola_nome || "—"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {u.roles.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
                        {u.roles.map((r) => (
                          <Badge
                            key={r}
                            variant={r === "super_admin" ? "default" : "secondary"}
                            className="cursor-pointer gap-1"
                            onClick={() => roleMutation.mutate({ userId: u.id, role: r, action: "remove" })}
                            title="Clique para remover"
                          >
                            {ROLE_LABEL[r] ?? r} ✕
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value=""
                        onValueChange={(role) => roleMutation.mutate({ userId: u.id, role, action: "add" })}
                      >
                        <SelectTrigger className="h-8 w-36">
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLE_OPTIONS.filter((o) => !u.roles.includes(o.value)).map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover usuário?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação remove permanentemente <strong>{u.nome || u.email}</strong> e todos os
                              seus dados. Não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => removeMutation.mutate(u.id)}
                            >
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
