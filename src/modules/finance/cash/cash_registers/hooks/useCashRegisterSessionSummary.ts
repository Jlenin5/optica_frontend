import { useQuery } from "@tanstack/react-query"
import { getCashRegisterSessionSummary } from "../api/cash-registers.api"

export const useCashRegisterSessionSummary = (id: number) => {
  return useQuery({
    queryKey: ["cash-register-sessions", "summary", id],
    queryFn: () => getCashRegisterSessionSummary(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}