import { useQuery } from "@tanstack/react-query"
import { getRoles } from "../api/roles.api"
import type { GetRolesParams } from "../types/roles.types"

export const useRoles = (params?: GetRolesParams) => {
  return useQuery({
    queryKey: ["roles", params],
    queryFn: () => getRoles(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  })
}