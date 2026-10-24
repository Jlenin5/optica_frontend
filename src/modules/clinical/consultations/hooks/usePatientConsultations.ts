import { useConsultations } from "./useConsultations"

// Historial de consultas de un paciente, a través de su historial clínico
// (Patient 1:1 MedicalRecord 1:N Consultation). El backend resuelve el join
// patient_id -> medical_record_id.
export const usePatientConsultations = (patientId: number, options?: { enabled?: boolean }) => {
  return useConsultations(
    { patient_id: patientId },
    { enabled: (options?.enabled !== undefined ? options.enabled : true) && !!patientId }
  )
}
