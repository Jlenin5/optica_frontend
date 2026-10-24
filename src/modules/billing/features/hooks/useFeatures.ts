import { useInfiniteQuery } from "@tanstack/react-query"
import { getFeatures } from "../api/features.api"
import type { GetFeaturesParams } from "../types/features.types"

export const useFeatures = (filters?: Omit<GetFeaturesParams, 'offset' | 'limit'>) => {
  return useInfiniteQuery({
    queryKey: ["features", filters],
    queryFn: ({ pageParam = 0 }) => 
      getFeatures({ ...filters, offset: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => lastPage.has_more ? lastPage.next_offset : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}