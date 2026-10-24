import { useInfiniteQuery } from "@tanstack/react-query"
import { getBrands } from "../api/brands.api"
import type { GetBrandsParams } from "../types/brands.types"
import { useAuthStore } from "@/app/store/auth.store"

export const useBrands = (filters?: Omit<GetBrandsParams, 'offset' | 'limit'>) => {
  const { user, currentCompanyId, isSuperAdmin } = useAuthStore()
  
  const companyFilter = !isSuperAdmin && currentCompanyId ? { company_id: currentCompanyId } : {}
  
  return useInfiniteQuery({
    queryKey: ["brands", { ...filters, ...companyFilter }],
    queryFn: ({ pageParam = 0 }) => 
      getBrands({ 
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