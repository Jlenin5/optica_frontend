import { useInfiniteQuery } from "@tanstack/react-query"
import { getPrescriptions } from "../api/prescriptions.api"
import type { GetPrescriptionsParams } from "../types/prescriptions.types"
import { useAuthStore } from "@/app/store/auth.store"

export const usePrescriptions = (filters?: Omit<GetPrescriptionsParams, 'offset' | 'limit'>) => {
  const { user, currentCompanyId, isSuperAdmin } = useAuthStore()
  
  // Si no es super_admin, filtrar por su empresa a través de los clientes
  const companyFilter = !isSuperAdmin && currentCompanyId ? { company_id: currentCompanyId } : {}
  
  return useInfiniteQuery({
    queryKey: ["prescriptions", { ...filters, ...companyFilter }],
    queryFn: ({ pageParam = 0 }) => 
      getPrescriptions({ 
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