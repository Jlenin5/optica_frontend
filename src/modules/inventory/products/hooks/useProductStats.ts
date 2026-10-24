import { useQuery } from "@tanstack/react-query"
import { getProductStats } from "../api/products.api"
import { useAuthStore } from "@/app/store/auth.store"

export const useProductStats = () => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  
  return useQuery({
    queryKey: ["products", "stats", { company_id: !isSuperAdmin ? currentCompanyId : undefined }],
    queryFn: () => getProductStats(!isSuperAdmin ? currentCompanyId || undefined : undefined),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}