import { useQuery } from "@tanstack/react-query"
import { getCategoryStats } from "../api/categories.api"
import { useAuthStore } from "@/app/store/auth.store"

export const useCategoryStats = () => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  
  return useQuery({
    queryKey: ["categories", "stats", { company_id: !isSuperAdmin ? currentCompanyId : undefined }],
    queryFn: () => getCategoryStats(!isSuperAdmin ? currentCompanyId || undefined : undefined),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}