import { useQuery } from "@tanstack/react-query"
import { getBankStats } from "../api/banks.api"

export const useBankStats = () => {
  return useQuery({
    queryKey: ["banks", "stats"],
    queryFn: getBankStats,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}