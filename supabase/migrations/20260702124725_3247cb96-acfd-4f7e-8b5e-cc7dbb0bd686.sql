-- Private schema not exposed by PostgREST API
CREATE SCHEMA IF NOT EXISTS private;

-- Recreate helper functions in the private schema
CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION private.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'super_admin'::public.app_role)
$$;

-- Allow authenticated users to execute them (needed for RLS evaluation),
-- but the private schema is not part of the exposed API so they are not callable via RPC.
GRANT USAGE ON SCHEMA private TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_super_admin(uuid) TO authenticated, service_role;

-- Repoint all policies to the private functions
ALTER POLICY "Super admins manage all alunos" ON public.alunos
  USING (private.is_super_admin(auth.uid())) WITH CHECK (private.is_super_admin(auth.uid()));
ALTER POLICY "Super admins manage all professores" ON public.professores
  USING (private.is_super_admin(auth.uid())) WITH CHECK (private.is_super_admin(auth.uid()));
ALTER POLICY "Super admins update all profiles" ON public.profiles
  USING (private.is_super_admin(auth.uid())) WITH CHECK (private.is_super_admin(auth.uid()));
ALTER POLICY "Super admins view all profiles" ON public.profiles
  USING (private.is_super_admin(auth.uid()));
ALTER POLICY "Super admins manage all turmas" ON public.turmas
  USING (private.is_super_admin(auth.uid())) WITH CHECK (private.is_super_admin(auth.uid()));
ALTER POLICY "Super admins delete roles" ON public.user_roles
  USING (private.is_super_admin(auth.uid()));
ALTER POLICY "Super admins insert roles" ON public.user_roles
  WITH CHECK (private.is_super_admin(auth.uid()));
ALTER POLICY "Super admins update roles" ON public.user_roles
  USING (private.is_super_admin(auth.uid())) WITH CHECK (private.is_super_admin(auth.uid()));
ALTER POLICY "Super admins view all roles" ON public.user_roles
  USING (private.is_super_admin(auth.uid()));

-- Remove the publicly-exposed SECURITY DEFINER functions
DROP FUNCTION IF EXISTS public.is_super_admin(uuid);
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
