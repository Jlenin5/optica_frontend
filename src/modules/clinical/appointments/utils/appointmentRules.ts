import type {
  AppointmentStatus,
  Appointment,
  CreateAppointmentDTO,
} from "../types/appointments.types"
import { APPOINTMENT_STATUS_TRANSITIONS } from "../types/appointments.types"

/**
 * Reglas de negocio para citas de óptica.
 */

export function canTransitionStatus(
  from: AppointmentStatus,
  to: AppointmentStatus,
): boolean {
  return (APPOINTMENT_STATUS_TRANSITIONS[from] || []).includes(to)
}

export function canLinkConsultation(appointment: Appointment): boolean {
  return (
    ["in_progress", "completed", "confirmed"].includes(appointment.status) &&
    !appointment.consultation_id
  )
}

export function canStartConsultation(appointment: Appointment): boolean {
  return ["scheduled", "confirmed"].includes(appointment.status)
}

export function canCancel(appointment: Appointment): boolean {
  return !["completed", "cancelled"].includes(appointment.status)
}

/**
 * Detecta solapamiento de horarios para el mismo optometrista.
 * duration_minutes por defecto 30.
 */
export function hasTimeConflict(
  existing: Array<{ date: string; time: string; duration_minutes?: number; optometrist_id?: number | null; id?: number }>,
  candidate: CreateAppointmentDTO,
  excludeId?: number,
): boolean {
  if (!candidate.optometrist_id || !candidate.date || !candidate.time) return false

  const candStart = toMinutes(candidate.time)
  const candDur = candidate.duration_minutes ?? 30
  const candEnd = candStart + candDur

  return existing.some((ap) => {
    if (excludeId && ap.id === excludeId) return false
    if (ap.optometrist_id !== candidate.optometrist_id) return false
    if (ap.date !== candidate.date) return false
    const start = toMinutes(ap.time)
    const end = start + (ap.duration_minutes ?? 30)
    return candStart < end && candEnd > start
  })
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number)
  return (h || 0) * 60 + (m || 0)
}

/** Genera slots disponibles de 30 min entre open y close, excluyendo ocupados */
export function availableSlots(
  occupied: Array<{ time: string; duration_minutes?: number }>,
  open = "08:00",
  close = "18:00",
  step = 30,
): string[] {
  const slots: string[] = []
  let t = toMinutes(open)
  const end = toMinutes(close)
  while (t + step <= end) {
    const label = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`
    const conflict = occupied.some((o) => {
      const s = toMinutes(o.time)
      const e = s + (o.duration_minutes ?? 30)
      return t < e && t + step > s
    })
    if (!conflict) slots.push(label)
    t += step
  }
  return slots
}
