import { useInfiniteQuery } from "@tanstack/react-query"
import { getStatuses } from "../api/statuses.api"
import type { GetStatusesParams } from "../types/statuses.types"

export const useStatuses = (
  filters?: Omit<GetStatusesParams, 'offset' | 'limit'>,
  options?: { enabled?: boolean }
) => {
  return useInfiniteQuery({
    queryKey: ["statuses", filters],
    queryFn: ({ pageParam = 0 }) => {
      const params: GetStatusesParams = {
        ...filters,
        offset: pageParam,
        limit: 20
      }
      return getStatuses(params)
    },
    enabled: options?.enabled !== undefined ? options.enabled && !!filters : !!filters,
    getNextPageParam: (lastPage) => lastPage.has_more ? lastPage.next_offset : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}
