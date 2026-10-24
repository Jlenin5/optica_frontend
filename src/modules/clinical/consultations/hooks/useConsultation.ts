import { useQuery } from "@tanstack/react-query"
import { consultationsApi } from "../api/consultations.api"

export const useConsultation = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["consultation", id],
    queryFn: () => consultationsApi.getDetail(id),
    enabled: options?.enabled !== undefined ? options.enabled && !!id : !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}
