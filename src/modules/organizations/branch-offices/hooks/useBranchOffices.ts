import { useInfiniteQuery } from "@tanstack/react-query"
import { getBranchOffices } from "../api/branch-offices.api"
import type { GetBranchOfficesParams } from "../types/branch-offices.types"
import { useAuthStore } from "@/app/store/auth.store"

export const useBranchOffices = (filters?: Omit<GetBranchOfficesParams, 'offset' | 'limit'>) => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  
  // Si no es super_admin, filtrar por su empresa
  const companyFilter = !isSuperAdmin && currentCompanyId ? { company_id: currentCompanyId } : {}
  
  return useInfiniteQuery({
    queryKey: ["branch-offices", { ...filters, ...companyFilter }],
    queryFn: ({ pageParam = 0 }) => 
      getBranchOffices({ 
        ...filters, 
        ...companyFilter,
        offset: pageParam, 
        limit: 20 
      }),
    getNextPageParam: (lastPage) => lastPage.has_more ? lastPage.next_offset : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}