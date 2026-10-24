import { useInfiniteQuery } from "@tanstack/react-query"
import { getUsers } from "../api/users.api"
import type { GetUsersParams } from "../types/users.types"
import { useAuthStore } from "@/app/store/auth.store"

export const useUsers = (
  filters?: Omit<GetUsersParams, 'offset' | 'limit'>,
  options?: { enabled?: boolean }
) => {
  const { user, currentCompanyId } = useAuthStore()
  
  // Si el usuario no es super_admin, filtrar por su empresa
  const isSuperAdmin = user?.is_superuser === true
  
  return useInfiniteQuery({
    queryKey: ["users", { ...filters, company_id: !isSuperAdmin ? currentCompanyId : undefined }],
    queryFn: ({ pageParam = 0 }) => {
      const params: GetUsersParams = {
        ...filters,
        offset: pageParam,
        limit: 20
      }
      
      // Si no es super_admin, filtrar por su empresa
      if (!isSuperAdmin && currentCompanyId) {
        params.company_id = currentCompanyId
      }
      
      return getUsers(params)
    },
    enabled: options?.enabled !== undefined ? options.enabled && !!filters : !!filters,
    getNextPageParam: (lastPage) => lastPage.has_more ? lastPage.next_offset : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}