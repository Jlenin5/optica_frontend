import { useQuery } from "@tanstack/react-query"
import { getPatientById } from "../api/patients.api"

export const usePatient = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["patient", id],
    queryFn: () => getPatientById(id),
    enabled: options?.enabled !== undefined ? options.enabled && !!id : !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}