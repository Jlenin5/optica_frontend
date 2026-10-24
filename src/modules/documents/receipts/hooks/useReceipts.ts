import { useInfiniteQuery } from "@tanstack/react-query"
import { getReceipts } from "../api/receipts.api"
import type { GetReceiptsParams } from "../types/receipts.types"

export const useReceipts = (filters?: Omit<GetReceiptsParams, 'offset' | 'limit'>) => {
  return useInfiniteQuery({
    queryKey: ["receipts", filters],
    queryFn: ({ pageParam = 0 }) => 
      getReceipts({ ...filters, offset: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => lastPage.has_more ? lastPage.next_offset : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}