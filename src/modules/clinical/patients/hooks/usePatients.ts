import { useInfiniteQuery } from "@tanstack/react-query"
import { getPatients } from "../api/patients.api"
import type { GetPatientsParams } from "../types/patients.types"
import { useAuthStore } from "@/app/store/auth.store"

export const usePatients = (filters?: Omit<GetPatientsParams, 'offset' | 'limit'>) => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  
  // Si no es super_admin, filtrar por su empresa
  const companyFilter = !isSuperAdmin && currentCompanyId ? { company_id: currentCompanyId } : {}
  
  return useInfiniteQuery({
    queryKey: ["patients", { ...filters, ...companyFilter }],
    queryFn: ({ pageParam = 0 }) => 
      getPatients({ 
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