import { useQuery } from "@tanstack/react-query"
import { getStatusStats } from "../api/statuses.api"

export const useStatusStats = () => {
  return useQuery({
    queryKey: ["statuses", "stats"],
    queryFn: getStatusStats,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}
