import { useQuery } from "@tanstack/react-query"
import { getBranchOfficeStats } from "../api/branch-offices.api"
import { useAuthStore } from "@/app/store/auth.store"

export const useBranchOfficeStats = () => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  
  return useQuery({
    queryKey: ["branch-offices", "stats", { company_id: !isSuperAdmin ? currentCompanyId : undefined }],
    queryFn: () => getBranchOfficeStats(!isSuperAdmin ? currentCompanyId || undefined : undefined),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}