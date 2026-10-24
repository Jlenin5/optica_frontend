import { useQuery } from "@tanstack/react-query"
import { getMedicalRecordByPatientId } from "../api/medical_records.api"

export const useMedicalRecordByPatient = (patientId: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["medical-record", "by-patient", patientId],
    queryFn: () => getMedicalRecordByPatientId(patientId),
    enabled: options?.enabled !== undefined ? options.enabled && !!patientId : !!patientId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
