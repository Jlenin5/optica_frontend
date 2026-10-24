import { useQuery } from "@tanstack/react-query"
import { getCashMovementStats } from "../api/cash-movements.api"
import { useActiveSession } from "@/modules/finance/cash/cash_registers/hooks/useActiveSession"

export const useCashMovementStats = () => {
  const { data: activeSession } = useActiveSession()
  const cashRegisterId = activeSession?.cash_register_id
  
  return useQuery({
    queryKey: ["cash-movements", "stats", cashRegisterId],
    queryFn: () => getCashMovementStats(cashRegisterId || undefined),
    enabled: !!cashRegisterId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}