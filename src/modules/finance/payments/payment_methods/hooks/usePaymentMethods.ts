import { useInfiniteQuery } from "@tanstack/react-query"
import { getPaymentMethods } from "../api/payment-methods.api"
import type { GetPaymentMethodsParams } from "../types/payment-methods.types"

export const usePaymentMethods = (filters?: Omit<GetPaymentMethodsParams, 'offset' | 'limit'>) => {
  return useInfiniteQuery({
    queryKey: ["payment-methods", filters],
    queryFn: ({ pageParam = 0 }) => 
      getPaymentMethods({ ...filters, offset: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => lastPage.has_more ? lastPage.next_offset : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}