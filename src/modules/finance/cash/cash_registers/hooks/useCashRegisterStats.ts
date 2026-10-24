import { useQuery } from "@tanstack/react-query"
import { getCashRegisterStats } from "../api/cash-registers.api"
import { useAuthStore } from "@/app/store/auth.store"

export const useCashRegisterStats = () => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  
  return useQuery({
    queryKey: ["cash-registers", "stats", { company_id: !isSuperAdmin ? currentCompanyId : undefined }],
    queryFn: () => getCashRegisterStats(!isSuperAdmin ? currentCompanyId || undefined : undefined),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}