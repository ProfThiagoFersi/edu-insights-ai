-- Role-check helpers are only used inside RLS policies (evaluated in the policy
-- owner context), so they no longer need direct EXECUTE access for signed-in users.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.is_super_admin(uuid) FROM authenticated;