import { useInfiniteQuery } from "@tanstack/react-query"
import { getLimits } from "../api/limits.api"
import type { GetLimitsParams } from "../types/limits.types"

export const useLimits = (filters?: Omit<GetLimitsParams, 'offset' | 'limit'>) => {
  return useInfiniteQuery({
    queryKey: ["limits", filters],
    queryFn: ({ pageParam = 0 }) => 
      getLimits({ ...filters, offset: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => lastPage.has_more ? lastPage.next_offset : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}