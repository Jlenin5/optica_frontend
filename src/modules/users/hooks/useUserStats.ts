import { useQuery } from "@tanstack/react-query"
import { getUserStats } from "../api/users.api"
import type { UserStats } from "../types/users.types"
import { useAuthStore } from "@/app/store/auth.store"

export const useUserStats = () => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()

  return useQuery({
    queryKey: ["users", "stats", { company_id: !isSuperAdmin ? currentCompanyId : undefined }],
    queryFn: () => {      
      // Si es super_admin, obtener estadísticas globales
      if (isSuperAdmin) {
        return getUserStats()
      }
      // Si no, obtener solo estadísticas de su empresa
      return getUserStats({ company_id: currentCompanyId || undefined })
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
    select: (data: UserStats) => {
      return {
        total: Number(data.total) || 0,
        active: Number(data.active) || 0,
        inactive: Number(data.inactive) || 0,
        admins: Number(data.admins) || 0,
        staff: Number(data.staff) || 0,
        by_role: data.by_role || []
      }
    }
  })
}