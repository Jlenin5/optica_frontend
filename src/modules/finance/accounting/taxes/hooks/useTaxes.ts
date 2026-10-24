import { useInfiniteQuery } from "@tanstack/react-query"
import { getTaxes } from "../api/taxes.api"
import type { GetTaxesParams } from "../types/taxes.types"

export const useTaxes = (filters?: Omit<GetTaxesParams, 'offset' | 'limit'>) => {
  return useInfiniteQuery({
    queryKey: ["taxes", filters],
    queryFn: ({ pageParam = 0 }) => 
      getTaxes({ ...filters, offset: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => lastPage.has_more ? lastPage.next_offset : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}