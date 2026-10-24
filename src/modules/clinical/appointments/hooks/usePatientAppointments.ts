import { useQuery } from "@tanstack/react-query"
import { getAppointments } from "../api/appointments.api"

export const usePatientAppointments = (patientId: number) => {
  return useQuery({
    queryKey: ["appointments", "patient", patientId],
    queryFn: () => getAppointments({ 
      patient_id: patientId,
      limit: 50 
    }),
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}