import { useQuery } from "@tanstack/react-query"
import { getPatientPrescriptions } from "../api/prescriptions.api"

export const usePatientPrescriptions = (patientId: number) => {
  return useQuery({
    queryKey: ["prescriptions", "patient", patientId],
    queryFn: () => getPatientPrescriptions(patientId),
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}