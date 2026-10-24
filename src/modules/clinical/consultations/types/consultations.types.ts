import type { User } from "@/modules/users/types/users.types"
import type { Appointment } from "../../appointments/types/appointments.types"
import type { MedicalRecord } from "../../medical_records/types/medical_records.types"
import type { Prescription } from "../../prescriptions/types/prescriptions.types"

// Consulta clínica.
// Relaciones:
//   MedicalRecord 1:N Consultation  -> medical_record_id (requerido)
//   Appointment   1:0..1 Consultation -> appointment_id (opcional, la cita en la que se realizó)
//   Consultation  1:1 Prescription  -> prescription (opcional, se genera al finalizar la consulta)
export interface Consultation {
  id: number
  medical_record_id: number
  medical_record?: MedicalRecord
  appointment_id?: number | null
  appointment?: Appointment | null
  patient_name?: string
  patient_document?: string
  appointment_date?: string
  optometrist: number | User
  optometrist_name?: string
  chief_complaint: string
  diagnosis: string
  observations: string
  recommendations: string
  visual_acuity_od: string
  visual_acuity_oi: string
  intraocular_pressure_od: string
  intraocular_pressure_oi: string
  prescription?: Prescription | null
  status: string
  created_at: string
  updated_at: string
  created_by_name?: string
  updated_by_name?: string
}

export interface ConsultationFormData {
  medical_record_id: number
  appointment?: number | null
  optometrist?: number | null
  chief_complaint?: string
  diagnosis?: string | null
  observations?: string | null
  recommendations?: string | null
  visual_acuity_od?: string | null
  visual_acuity_oi?: string | null
  intraocular_pressure_od?: string | null
  intraocular_pressure_oi?: string | null
  status?: string | null
}

export const CONSULTATION_STATUS = {
  DRAFT: 'draft',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const

export const CONSULTATION_STATUS_LABELS: Record<string, string> = {
  [CONSULTATION_STATUS.DRAFT]: 'Borrador',
  [CONSULTATION_STATUS.COMPLETED]: 'Completada',
  [CONSULTATION_STATUS.CANCELLED]: 'Cancelada'
}

// Clase de badge (status-badge--success|warning|info|error) por cada estado.
// Centralizado aquí para que ConsultationList y ConsultationDetailPage no
// diverjan usando valores de estado distintos.
export const CONSULTATION_STATUS_BADGE_CLASS: Record<string, string> = {
  [CONSULTATION_STATUS.DRAFT]: 'status-badge--warning',
  [CONSULTATION_STATUS.COMPLETED]: 'status-badge--success',
  [CONSULTATION_STATUS.CANCELLED]: 'status-badge--error'
}
