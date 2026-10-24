import { useQuery } from "@tanstack/react-query"
import { getDayOfCreditStats } from "../api/days-of-credit.api"

export const useDayOfCreditStats = () => {
  return useQuery({
    queryKey: ["days-of-credit", "stats"],
    queryFn: getDayOfCreditStats,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}