import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyRoles } from "@/lib/admin.functions";
import { useAuth } from "@/hooks/use-auth";

export function useSuperAdmin() {
  const { session } = useAuth();
  const fetchRoles = useServerFn(getMyRoles);
  const { data, isLoading } = useQuery({
    queryKey: ["my-roles", session?.user?.id],
    queryFn: () => fetchRoles(),
    enabled: !!session,
    staleTime: 5 * 60 * 1000,
  });
  return { isSuperAdmin: data?.isSuperAdmin ?? false, loading: isLoading };
}
