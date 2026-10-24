import { useQuery } from "@tanstack/react-query"
import { getReceiptStats } from "../api/receipts.api"

export const useReceiptStats = () => {
  return useQuery({
    queryKey: ["receipts", "stats"],
    queryFn: getReceiptStats,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}