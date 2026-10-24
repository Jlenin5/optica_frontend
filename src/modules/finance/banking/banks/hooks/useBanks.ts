import { useInfiniteQuery } from "@tanstack/react-query"
import { getBanks } from "../api/banks.api"
import type { GetBanksParams } from "../types/banks.types"

export const useBanks = (filters?: Omit<GetBanksParams, 'offset' | 'limit'>) => {
  return useInfiniteQuery({
    queryKey: ["banks", filters],
    queryFn: ({ pageParam = 0 }) => 
      getBanks({ ...filters, offset: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => lastPage.has_more ? lastPage.next_offset : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}