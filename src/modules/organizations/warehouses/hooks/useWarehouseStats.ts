import { useQuery } from "@tanstack/react-query"
import { getWarehouseStats } from "../api/warehouses.api"
import { useAuthStore } from "@/app/store/auth.store"

export const useWarehouseStats = () => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  
  return useQuery({
    queryKey: ["warehouses", "stats", { company_id: !isSuperAdmin ? currentCompanyId : undefined }],
    queryFn: () => getWarehouseStats(!isSuperAdmin ? currentCompanyId || undefined : undefined),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}