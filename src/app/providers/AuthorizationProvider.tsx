import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { getMyPermissions } from "@/modules/permissions/api/permissions.api"
import { useAuthStore } from "@/app/store/auth.store"

/**
 * Keeps the client-side authorization cache aligned with the backend.
 * The API remains the final authority for every operation.
 */
export function AuthorizationProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const setPermissions = useAuthStore(s => s.setPermissions)

  const query = useQuery({
    queryKey: ["authorization", "me"],
    queryFn: getMyPermissions,
    enabled: isAuthenticated,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  })

  useEffect(() => {
    if (query.data) setPermissions(query.data.permissions ?? query.data.permission_codes ?? [])
  }, [query.data, setPermissions])

  return <>{children}</>
}
