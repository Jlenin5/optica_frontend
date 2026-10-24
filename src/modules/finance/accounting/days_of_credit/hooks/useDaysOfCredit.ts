import { useInfiniteQuery } from "@tanstack/react-query"
import { getDaysOfCredit } from "../api/days-of-credit.api"
import type { GetDaysOfCreditParams } from "../types/days-of-credit.types"

export const useDaysOfCredit = (filters?: Omit<GetDaysOfCreditParams, 'offset' | 'limit'>) => {
  return useInfiniteQuery({
    queryKey: ["days-of-credit", filters],
    queryFn: ({ pageParam = 0 }) => 
      getDaysOfCredit({ ...filters, offset: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => lastPage.has_more ? lastPage.next_offset : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}