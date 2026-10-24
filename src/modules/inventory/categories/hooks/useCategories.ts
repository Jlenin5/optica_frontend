import { useInfiniteQuery } from "@tanstack/react-query"
import { getCategories } from "../api/categories.api"
import type { GetCategoriesParams } from "../types/categories.types"
import { useAuthStore } from "@/app/store/auth.store"

export const useCategories = (filters?: Omit<GetCategoriesParams, 'offset' | 'limit'>) => {
  const { user, currentCompanyId, isSuperAdmin } = useAuthStore()
  
  const companyFilter = !isSuperAdmin && currentCompanyId ? { company_id: currentCompanyId } : {}
  
  return useInfiniteQuery({
    queryKey: ["categories", { ...filters, ...companyFilter }],
    queryFn: ({ pageParam = 0 }) => 
      getCategories({ 
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