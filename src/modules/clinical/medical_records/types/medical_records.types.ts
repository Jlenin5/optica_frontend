import type { Patient } from "@/modules/clinical/patients/types/patients.types"

// Historial Clínico del paciente.
// Relación: Patient 1:1 MedicalRecord — cada paciente tiene exactamente un
// historial clínico, creado la primera vez que se le atiende.
export interface MedicalRecord {
  id: number
  patient_id: number
  patient?: Patient | null
  blood_type?: string | null
  allergies?: string | null
  chronic_conditions?: string | null
  family_history?: string | null
  general_observations?: string | null
  // Cantidad de consultas (Consultation) registradas bajo este historial (MedicalRecord 1:N Consultation)
  consultations_count?: number
  status: boolean
  created_at: string
  updated_at: string
  created_by_name?: string
  updated_by_name?: string
}

export interface CreateMedicalRecordDTO {
  patient_id: number
  blood_type?: string | null
  allergies?: string | null
  chronic_conditions?: string | null
  family_history?: string | null
  general_observations?: string | null
}

export interface UpdateMedicalRecordDTO {
  blood_type?: string | null
  allergies?: string | null
  chronic_conditions?: string | null
  family_history?: string | null
  general_observations?: string | null
  status?: boolean
}

export interface MedicalRecordFormData {
  blood_type?: string | null
  allergies?: string | null
  chronic_conditions?: string | null
  family_history?: string | null
  general_observations?: string | null
}
