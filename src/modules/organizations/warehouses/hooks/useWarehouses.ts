import { useInfiniteQuery } from "@tanstack/react-query"
import { getWarehouses } from "../api/warehouses.api"
import type { GetWarehousesParams } from "../types/warehouses.types"
import { useAuthStore } from "@/app/store/auth.store"

export const useWarehouses = (filters?: Omit<GetWarehousesParams, 'offset' | 'limit'>) => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  
  // Si no es super_admin, filtrar por su empresa
  const companyFilter = !isSuperAdmin && currentCompanyId ? { company_id: currentCompanyId } : {}
  
  return useInfiniteQuery({
    queryKey: ["warehouses", { ...filters, ...companyFilter }],
    queryFn: ({ pageParam = 0 }) => 
      getWarehouses({ 
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