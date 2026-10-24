import { useQuery } from "@tanstack/react-query"
import { getPlanLimitsByPlan } from "../api/limits.api"
import type { PlanLimit } from "../types/limits.types"

export const usePlanLimits = (planId: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["plan-limits", planId],
    queryFn: () => getPlanLimitsByPlan(planId),
    enabled: options?.enabled !== undefined ? options.enabled && !!planId : !!planId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    select: (data) => {
      // Transformar los datos si es necesario
      return data.map((limit: PlanLimit) => ({
        ...limit,
        limit: {
          id: limit.limit_id,
          code: limit.code || '',
          name: limit.name || ''
        }
      }))
    }
  })
}