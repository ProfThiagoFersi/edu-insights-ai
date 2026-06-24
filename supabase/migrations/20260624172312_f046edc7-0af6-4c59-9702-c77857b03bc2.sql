-- Lock down SECURITY DEFINER functions from being directly callable via the API

-- Trigger functions: not meant to be called directly by anyone (triggers run regardless of EXECUTE grants)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- Role-check helpers: remove blanket/anon access, keep them callable by signed-in users
-- (used by RLS policies and by authenticated RPC calls in the app)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_super_admin(uuid) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin(uuid) TO authenticated;