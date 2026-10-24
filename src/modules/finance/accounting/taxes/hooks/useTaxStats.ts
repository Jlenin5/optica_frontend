import { useQuery } from "@tanstack/react-query"
import { getTaxStats } from "../api/taxes.api"

export const useTaxStats = () => {
  return useQuery({
    queryKey: ["taxes", "stats"],
    queryFn: getTaxStats,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}