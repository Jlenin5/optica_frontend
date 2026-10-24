import { useQuery } from "@tanstack/react-query"
import { getTypeOfReceiptStats } from "../api/type-of-receipts.api"

export const useTypeOfReceiptStats = () => {
  return useQuery({
    queryKey: ["type-of-receipts", "stats"],
    queryFn: getTypeOfReceiptStats,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}