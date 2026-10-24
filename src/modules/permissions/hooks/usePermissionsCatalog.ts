import { useQuery } from "@tanstack/react-query"
import { getPermissions } from "../api/permissions.api"

export const usePermissionsCatalog = () =>
  useQuery({
    queryKey: ["permissions", "catalog"],
    queryFn: () => getPermissions({ limit: 500 }),
    staleTime: 5 * 60 * 1000,
  })
