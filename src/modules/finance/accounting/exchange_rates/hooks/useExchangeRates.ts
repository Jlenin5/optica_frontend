import { useInfiniteQuery } from "@tanstack/react-query"
import { getExchangeRates } from "../api/exchange-rates.api"
import type { GetExchangeRatesParams } from "../types/exchange-rates.types"

export const useExchangeRates = (filters?: Omit<GetExchangeRatesParams, 'offset' | 'limit'>) => {
  return useInfiniteQuery({
    queryKey: ["exchange-rates", filters],
    queryFn: ({ pageParam = 0 }) => 
      getExchangeRates({ ...filters, offset: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => lastPage.has_more ? lastPage.next_offset : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}