import { useInfiniteQuery } from "@tanstack/react-query"
import { getCashRegisters } from "../api/cash-registers.api"
import type { GetCashRegistersParams } from "../types/cash-registers.types"
import { useAuthStore } from "@/app/store/auth.store"

export const useCashRegisters = (filters?: Omit<GetCashRegistersParams, 'offset' | 'limit'>) => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  
  const companyFilter = !isSuperAdmin && currentCompanyId ? { company_id: currentCompanyId } : {}
  
  return useInfiniteQuery({
    queryKey: ["cash-registers", { ...filters, ...companyFilter }],
    queryFn: ({ pageParam = 0 }) => 
      getCashRegisters({ 
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