import { useQuery } from "@tanstack/react-query"
import { getMedicalRecordById } from "../api/medical_records.api"

export const useMedicalRecord = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["medical-record", id],
    queryFn: () => getMedicalRecordById(id),
    enabled: options?.enabled !== undefined ? options.enabled && !!id : !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}
