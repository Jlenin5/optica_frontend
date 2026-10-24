import { useQuery } from "@tanstack/react-query"
import { getExchangeRateStats } from "../api/exchange-rates.api"

export const useExchangeRateStats = () => {
  return useQuery({
    queryKey: ["exchange-rates", "stats"],
    queryFn: getExchangeRateStats,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}