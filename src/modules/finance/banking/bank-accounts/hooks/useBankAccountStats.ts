import { useQuery } from "@tanstack/react-query"
import { getBankAccountStats } from "../api/bank-accounts.api"
import { useAuthStore } from "@/app/store/auth.store"

export const useBankAccountStats = () => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  
  return useQuery({
    queryKey: ["bank-accounts", "stats", { company_id: !isSuperAdmin ? currentCompanyId : undefined }],
    queryFn: () => getBankAccountStats(!isSuperAdmin ? currentCompanyId || undefined : undefined),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}