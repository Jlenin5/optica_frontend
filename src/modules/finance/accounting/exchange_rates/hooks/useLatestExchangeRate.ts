import { useQuery } from "@tanstack/react-query"
import { getLatestExchangeRate } from "../api/exchange-rates.api"

export const useLatestExchangeRate = () => {
  return useQuery({
    queryKey: ["exchange-rates", "latest"],
    queryFn: getLatestExchangeRate,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}