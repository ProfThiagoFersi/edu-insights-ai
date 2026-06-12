import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ROLES = ["diretor", "vice_diretor", "coordenador", "supervisor", "super_admin"] as const;

async function assertSuperAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("is_super_admin", {
    _user_id: context.userId,
  });
  if (error) throw new Error("Falha ao verificar permissões.");
  if (!data) throw new Error("Acesso negado: apenas superadministradores.");
}

export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const roles = (data ?? []).map((r: { role: string }) => r.role);
    return { roles, isSuperAdmin: roles.includes("super_admin") };
  });

export const getPlatformStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertSuperAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const tables = ["profiles", "alunos", "professores", "turmas"] as const;
    const counts: Record<string, number> = {};
    for (const t of tables) {
      const { count } = await supabaseAdmin.from(t).select("*", { count: "exact", head: true });
      counts[t] = count ?? 0;
    }
    const { count: emRisco } = await supabaseAdmin
      .from("alunos")
      .select("*", { count: "exact", head: true })
      .neq("status", "regular");

    const { data: escolas } = await supabaseAdmin.from("profiles").select("escola_nome");
    const escolasUnicas = new Set(
      (escolas ?? []).map((e: { escola_nome: string }) => (e.escola_nome || "").trim().toLowerCase()).filter(Boolean),
    ).size;

    return {
      usuarios: counts.profiles,
      escolas: escolasUnicas,
      alunos: counts.alunos,
      professores: counts.professores,
      turmas: counts.turmas,
      alunosEmRisco: emRisco ?? 0,
    };
  });

export const listUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertSuperAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, nome, escola_nome, cargo, created_at");
    const { data: roleRows } = await supabaseAdmin.from("user_roles").select("user_id, role");

    const rolesByUser = new Map<string, string[]>();
    for (const r of roleRows ?? []) {
      const arr = rolesByUser.get(r.user_id) ?? [];
      arr.push(r.role);
      rolesByUser.set(r.user_id, arr);
    }

    const { data: authData } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const emailById = new Map<string, string>();
    for (const u of authData?.users ?? []) emailById.set(u.id, u.email ?? "");

    const users = (profiles ?? []).map((p: any) => ({
      id: p.id,
      nome: p.nome,
      email: emailById.get(p.id) ?? "",
      escola_nome: p.escola_nome,
      cargo: p.cargo,
      created_at: p.created_at,
      roles: rolesByUser.get(p.id) ?? [],
    }));

    return { users };
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({
      userId: z.string().uuid(),
      role: z.enum(ROLES),
      action: z.enum(["add", "remove"]),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (data.action === "remove") {
      if (data.role === "super_admin" && data.userId === context.userId) {
        throw new Error("Você não pode remover seu próprio acesso de superadministrador.");
      }
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", data.role);
      if (error) throw new Error("Falha ao remover papel.");
    } else {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: data.userId, role: data.role }, { onConflict: "user_id,role" });
      if (error) throw new Error("Falha ao atribuir papel.");
    }
    return { ok: true };
  });

export const removeUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ userId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context);
    if (data.userId === context.userId) {
      throw new Error("Você não pode remover sua própria conta.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error("Falha ao remover usuário.");
    return { ok: true };
  });
