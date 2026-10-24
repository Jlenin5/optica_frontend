import { useInfiniteQuery } from "@tanstack/react-query"
import { getPlans } from "../api/plans.api"
import type { GetPlansParams } from "../types/plans.types"

export const usePlans = (filters?: Omit<GetPlansParams, 'offset' | 'limit'>) => {
  return useInfiniteQuery({
    queryKey: ["plans", filters],
    queryFn: ({ pageParam = 0 }) => 
      getPlans({ ...filters, offset: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => lastPage.has_more ? lastPage.next_offset : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}