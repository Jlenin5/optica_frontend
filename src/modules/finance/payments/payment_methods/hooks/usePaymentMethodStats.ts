import { useQuery } from "@tanstack/react-query"
import { getPaymentMethodStats } from "../api/payment-methods.api"

export const usePaymentMethodStats = () => {
  return useQuery({
    queryKey: ["payment-methods", "stats"],
    queryFn: getPaymentMethodStats,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}