import { useQuery } from "@tanstack/react-query"
import { getPrescriptionByConsultationId } from "../api/prescriptions.api"

export const usePrescriptionByConsultation = (consultationId: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["prescription", "by-consultation", consultationId],
    queryFn: () => getPrescriptionByConsultationId(consultationId),
    enabled: options?.enabled !== undefined ? options.enabled && !!consultationId : !!consultationId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
