import { useQuery } from "@tanstack/react-query"
import { getCurrencyStats } from "../api/currencies.api"

export const useCurrencyStats = () => {
  return useQuery({
    queryKey: ["currencies", "stats"],
    queryFn: getCurrencyStats,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}