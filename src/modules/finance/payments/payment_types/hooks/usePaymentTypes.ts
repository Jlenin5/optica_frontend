import { useInfiniteQuery } from "@tanstack/react-query"
import { getPaymentTypes } from "../api/payment-types.api"
import type { GetPaymentTypesParams } from "../types/payment-types.types"

export const usePaymentTypes = (filters?: Omit<GetPaymentTypesParams, 'offset' | 'limit'>) => {
  return useInfiniteQuery({
    queryKey: ["payment-types", filters],
    queryFn: ({ pageParam = 0 }) => 
      getPaymentTypes({ ...filters, offset: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => lastPage.has_more ? lastPage.next_offset : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}