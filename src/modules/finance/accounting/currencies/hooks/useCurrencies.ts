import { useInfiniteQuery } from "@tanstack/react-query"
import { getCurrencies } from "../api/currencies.api"
import type { GetCurrenciesParams } from "../types/currencies.types"

export const useCurrencies = (filters?: Omit<GetCurrenciesParams, 'offset' | 'limit'>) => {
  return useInfiniteQuery({
    queryKey: ["currencies", filters],
    queryFn: ({ pageParam = 0 }) => 
      getCurrencies({ ...filters, offset: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => lastPage.has_more ? lastPage.next_offset : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}