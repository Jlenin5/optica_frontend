import { useInfiniteQuery } from "@tanstack/react-query"
import { getStores } from "../api/stores.api"
import type { GetStoresParams } from "../types/stores.types"
import { useAuthStore } from "@/app/store/auth.store"

export const useStores = (filters?: Omit<GetStoresParams, 'offset' | 'limit'>) => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  
  // Si no es super_admin, filtrar por su empresa
  const companyFilter = !isSuperAdmin && currentCompanyId ? { company_id: currentCompanyId } : {}
  
  return useInfiniteQuery({
    queryKey: ["stores", { ...filters, ...companyFilter }],
    queryFn: ({ pageParam = 0 }) => 
      getStores({ 
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