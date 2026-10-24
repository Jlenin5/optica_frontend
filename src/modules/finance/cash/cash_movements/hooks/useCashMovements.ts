import { useInfiniteQuery } from "@tanstack/react-query"
import { getCashMovements } from "../api/cash-movements.api"
import type { GetCashMovementsParams } from "../types/cash-movements.types"
import { useAuthStore } from "@/app/store/auth.store"

export const useCashMovements = (filters?: Omit<GetCashMovementsParams, 'offset' | 'limit'>) => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  
  const companyFilter = !isSuperAdmin && currentCompanyId ? { company_id: currentCompanyId } : {}
  
  return useInfiniteQuery({
    queryKey: ["cash-movements", { ...filters, ...companyFilter }],
    queryFn: ({ pageParam = 0 }) => 
      getCashMovements({ 
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