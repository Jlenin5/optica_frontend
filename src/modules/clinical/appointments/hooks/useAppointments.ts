// hooks/useAppointments.ts
import { useInfiniteQuery } from "@tanstack/react-query"
import { getAppointments } from "../api/appointments.api"
import type { GetAppointmentsParams } from "../types/appointments.types"
import { useAuthStore } from "@/app/store/auth.store"
import { useDebounce } from "@/hooks/useDebounce"

export const useAppointments = (filters?: Omit<GetAppointmentsParams, 'offset' | 'limit'>) => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  
  // Aplicar debounce solo al search
  const debouncedSearch = useDebounce(filters?.search, 500)
  
  const companyFilter = !isSuperAdmin && currentCompanyId ? { company_id: currentCompanyId } : {}
  
  // Crear filtros con el search debounced
  const debouncedFilters = {
    ...filters,
    search: debouncedSearch
  }
  
  const queryResult = useInfiniteQuery({
    queryKey: ["appointments", { ...debouncedFilters, ...companyFilter }],
    queryFn: ({ pageParam = 0 }) => 
      getAppointments({ 
        ...debouncedFilters, 
        ...companyFilter,
        offset: pageParam, 
        limit: 20 
      }),
    getNextPageParam: (lastPage) => lastPage.has_more ? lastPage.next_offset : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    select: (data) => {
      return {
        ...data,
        pages: data.pages.map(page => ({
          ...page,
          results: page.results.map((appointment: any) => ({
            ...appointment,
            prescription: appointment.prescription || null
          }))
        }))
      }
    }
  })

  // Exponer si es la primera carga
  return {
    ...queryResult,
    isInitialLoading: queryResult.isLoading && queryResult.isFetching && !queryResult.data
  }
}