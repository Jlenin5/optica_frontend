import { useQuery } from "@tanstack/react-query"
import { getPlanFeatures } from "../api/features.api"
import type { PlanFeature } from "../types/features.types"

export const usePlanFeatures = (planId: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["plan-features", planId],
    queryFn: () => getPlanFeatures(planId),
    enabled: options?.enabled !== undefined ? options.enabled && !!planId : !!planId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    select: (data) => {
      // Transformar los datos para que tengan la estructura esperada por la tabla
      return data.map((item: PlanFeature) => ({
        id: item.id,
        feature_id: item.feature_id,
        feature: {
          id: item.feature_id,
          code: item.code || '',
          name: item.name || '',
          description: item.description || ''
        }
      }))
    }
  })
}