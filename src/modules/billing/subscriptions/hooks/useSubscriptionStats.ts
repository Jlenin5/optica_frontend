import { useQuery } from "@tanstack/react-query"
import { getSubscriptionStats } from "../api/subscriptions.api"

export const useSubscriptionStats = () => {
  return useQuery({
    queryKey: ["subscriptions", "stats"],
    queryFn: getSubscriptionStats,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    refetchInterval: 60000, // Refetch cada minuto
  })
}