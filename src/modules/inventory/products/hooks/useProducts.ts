import { useInfiniteQuery } from "@tanstack/react-query"
import { getProducts } from "../api/products.api"
import type { GetProductsParams } from "../types/products.types"
import { useAuthStore } from "@/app/store/auth.store"

export const useProducts = (filters?: Omit<GetProductsParams, 'offset' | 'limit'>) => {
  const { user, currentCompanyId } = useAuthStore()
  
  const isSuperAdmin = user?.is_superuser === true
  
  return useInfiniteQuery({
    queryKey: ["products", { ...filters, company_id: !isSuperAdmin ? currentCompanyId : undefined }],
    queryFn: ({ pageParam = 0 }) =>  {
      const params: GetProductsParams = { 
        ...filters,
        offset: pageParam, 
        limit: 20 
      }

      // Si no es super_admin, filtrar por su empresa
      if (!isSuperAdmin && currentCompanyId) {
        params.company_id = currentCompanyId
      }

      return getProducts(params)
    },
    getNextPageParam: (lastPage) => lastPage.has_more ? lastPage.next_offset : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}