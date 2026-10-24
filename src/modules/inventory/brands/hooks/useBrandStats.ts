import { useQuery } from "@tanstack/react-query"
import { getBrandStats } from "../api/brands.api"
import { useAuthStore } from "@/app/store/auth.store"

export const useBrandStats = () => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  
  return useQuery({
    queryKey: ["brands", "stats", { company_id: !isSuperAdmin ? currentCompanyId : undefined }],
    queryFn: () => getBrandStats(!isSuperAdmin ? currentCompanyId || undefined : undefined),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}