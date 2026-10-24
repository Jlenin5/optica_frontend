import { useInfiniteQuery } from "@tanstack/react-query"
import { getSubscriptions } from "../api/subscriptions.api"
import type { GetSubscriptionsParams } from "../types/subscriptions.types"

export const useSubscriptions = (filters?: Omit<GetSubscriptionsParams, 'offset' | 'limit'>) => {
  return useInfiniteQuery({
    queryKey: ["subscriptions", filters],
    queryFn: ({ pageParam = 0 }) => 
      getSubscriptions({ ...filters, offset: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => lastPage.has_more ? lastPage.next_offset : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}