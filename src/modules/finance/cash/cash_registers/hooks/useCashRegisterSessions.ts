import { useInfiniteQuery } from "@tanstack/react-query"
import { getCashRegisterSessions } from "../api/cash-registers.api"
import type { GetCashRegisterSessionsParams } from "../types/cash-registers.types"

export const useCashRegisterSessions = (filters?: Omit<GetCashRegisterSessionsParams, 'offset' | 'limit'>) => {
  return useInfiniteQuery({
    queryKey: ["cash-register-sessions", filters],
    queryFn: ({ pageParam = 0 }) => 
      getCashRegisterSessions({ ...filters, offset: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => lastPage.has_more ? lastPage.next_offset : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}