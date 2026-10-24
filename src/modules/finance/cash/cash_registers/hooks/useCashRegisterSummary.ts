import { useQuery } from "@tanstack/react-query"
import { getCashRegisterSummary } from "../api/cash-registers.api"

export const useCashRegisterSummary = (id: number) => {
  return useQuery({
    queryKey: ["cash-registers", "summary", id],
    queryFn: () => getCashRegisterSummary(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}