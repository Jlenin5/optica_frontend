import { useQuery } from "@tanstack/react-query"
import { getPrescriptionStats } from "../api/prescriptions.api"
import { useAuthStore } from "@/app/store/auth.store"

export const usePrescriptionStats = () => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  
  return useQuery({
    queryKey: ["prescriptions", "stats", { company_id: !isSuperAdmin ? currentCompanyId : undefined }],
    queryFn: () => getPrescriptionStats(!isSuperAdmin ? currentCompanyId || undefined : undefined),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}