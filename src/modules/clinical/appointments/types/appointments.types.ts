import type { Patient } from "@/modules/clinical/patients/types/patients.types"
import type { User } from "@users/types/users.types"
import type { Consultation } from "../../consultations/types/consultations.types"

/**
 * Estados de cita para óptica / clínica.
 * Flujo típico: scheduled → confirmed → in_progress → completed
 * Alternativas: cancelled | no_show
 */
export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'

/**
 * Tipos de cita habituales en una óptica.
 */
export type AppointmentType =
  | 'consulta'
  | 'control'
  | 'contactologia'
  | 'entrega'
  | 'reparacion'
  | 'otro'

export interface Appointment {
  id: number
  company_id?: number
  branch_office_id?: number | null
  store_id?: number | null
  patient_id: number
  patient?: Patient | null
  optometrist_id: number | null
  optometrist?: User | null
  /** Consulta clínica vinculada (1:0..1). La prescripción se obtiene vía consultation.prescription */
  consultation_id?: number | null
  consultation?: Consultation | null
  date: string
  time: string
  /** Duración en minutos (default 30) */
  duration_minutes?: number
  end_time?: string
  appointment_type?: AppointmentType
  notes: string | null
  internal_notes?: string | null
  status: AppointmentStatus
  /** Cita anónima / sin mostrar nombre completo (privacidad) */
  is_anonymous?: boolean
  /** Bloqueo de agenda (fuera de oficina, mantenimiento, etc.) */
  is_blocked?: boolean
  block_reason?: string | null
  room?: string | null
  color?: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  created_by?: {
    id: number
    username: string
    email?: string
  }
  updated_by?: {
    id: number
    username: string
    email?: string
  }
}

export interface GetAppointmentsParams {
  limit?: number
  offset?: number
  search?: string
  status?: AppointmentStatus
  patient_id?: number
  optometrist_id?: number
  date_from?: string
  date_to?: string
  date?: string
  company_id?: number
  branch_office_id?: number
  appointment_type?: AppointmentType
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  limit: number
  has_more: boolean
  next_offset: number
  next_after_id: number | null
}

export interface CreateAppointmentDTO {
  patient_id: number | null
  optometrist_id?: number | null
  date: string
  time: string
  duration_minutes?: number
  appointment_type?: AppointmentType
  notes?: string | null
  internal_notes?: string | null
  status?: AppointmentStatus
  is_anonymous?: boolean
  room?: string | null
  company_id?: number
  branch_office_id?: number | null
  store_id?: number | null
}

export interface UpdateAppointmentDTO {
  patient_id?: number
  optometrist_id?: number | null
  date?: string
  time?: string
  duration_minutes?: number
  appointment_type?: AppointmentType
  notes?: string | null
  internal_notes?: string | null
  status?: AppointmentStatus
  is_anonymous?: boolean
  room?: string | null
}

export interface AppointmentStats {
  total: number
  scheduled: number
  confirmed: number
  in_progress: number
  completed: number
  cancelled: number
  no_show: number
  today: number
  this_week: number
  upcoming: number
  by_optometrist: {
    optometrist_id: number
    optometrist_name: string
    count: number
  }[]
  by_status: {
    status: string
    count: number
  }[]
}

export interface CalendarEvent {
  id: number
  title: string
  start: string
  end: string
  patientName: string
  patientId: number
  optometristName?: string
  optometristId?: number | null
  notes?: string
  status: AppointmentStatus
  appointmentType?: AppointmentType
  color?: string
  isAnonymous?: boolean
  isBlocked?: boolean
  blockReason?: string
  room?: string
  durationMinutes?: number
}

/** Transiciones de estado permitidas */
export const APPOINTMENT_STATUS_TRANSITIONS: Record<
  AppointmentStatus,
  AppointmentStatus[]
> = {
  scheduled: ['confirmed', 'cancelled', 'no_show', 'in_progress'],
  confirmed: ['in_progress', 'cancelled', 'no_show', 'completed'],
  in_progress: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
  no_show: ['scheduled'],
}

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  scheduled: 'Programada',
  confirmed: 'Confirmada',
  in_progress: 'En consulta',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No asistió',
}

export const APPOINTMENT_TYPE_LABELS: Record<AppointmentType, string> = {
  consulta: 'Consulta / Examen visual',
  control: 'Control',
  contactologia: 'Contactología',
  entrega: 'Entrega de lentes',
  reparacion: 'Reparación',
  otro: 'Otro',
}

/** Colores por estado (alineados con UI de agenda clínica) */
export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatus, string> = {
  scheduled: '#3b82f6',
  confirmed: '#0ea5e9',
  in_progress: '#8b5cf6',
  completed: '#10b981',
  cancelled: '#94a3b8',
  no_show: '#ef4444',
}

export const APPOINTMENT_TYPE_COLORS: Record<AppointmentType, string> = {
  consulta: '#3b82f6',
  control: '#0ea5e9',
  contactologia: '#8b5cf6',
  entrega: '#10b981',
  reparacion: '#f59e0b',
  otro: '#64748b',
}
