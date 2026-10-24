import { useQuery } from "@tanstack/react-query"
import { getPaymentTypeStats } from "../api/payment-types.api"

export const usePaymentTypeStats = () => {
  return useQuery({
    queryKey: ["payment-types", "stats"],
    queryFn: getPaymentTypeStats,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}