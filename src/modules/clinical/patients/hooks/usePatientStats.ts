import { useQuery } from "@tanstack/react-query"
import { getPatientStats } from "../api/patients.api"
import { useAuthStore } from "@/app/store/auth.store"

export const usePatientStats = () => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  
  return useQuery({
    queryKey: ["patients", "stats", { company_id: !isSuperAdmin ? currentCompanyId : undefined }],
    queryFn: () => getPatientStats(!isSuperAdmin ? currentCompanyId || undefined : undefined),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}