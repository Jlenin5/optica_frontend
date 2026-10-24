import { useQuery } from "@tanstack/react-query"
import { getPlanStats } from "../api/plans.api"

export const usePlanStats = () => {
  return useQuery({
    queryKey: ["plans", "stats"],
    queryFn: getPlanStats,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}