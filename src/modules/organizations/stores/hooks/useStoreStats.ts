import { useQuery } from "@tanstack/react-query"
import { getStoreStats } from "../api/stores.api"
import { useAuthStore } from "@/app/store/auth.store"

export const useStoreStats = () => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  
  return useQuery({
    queryKey: ["stores", "stats", { company_id: !isSuperAdmin ? currentCompanyId : undefined }],
    queryFn: () => getStoreStats(!isSuperAdmin ? currentCompanyId || undefined : undefined),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}