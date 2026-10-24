import type { Appointment, AppointmentStatus } from "../types/appointments.types"

/** Regla de negocio: una cita solo puede originar una venta cuando está completada. */
export const SALE_ALLOWED_APPOINTMENT_STATUSES: AppointmentStatus[] = ["completed"]

export const canCreateSaleFromAppointment = (appointment: Pick<Appointment, "status" | "patient_id">) =>
  SALE_ALLOWED_APPOINTMENT_STATUSES.includes(appointment.status.toLowerCase() as AppointmentStatus)

export const validateSaleOrigin = (
  appointment: Pick<Appointment, "status" | "patient_id">,
  patientId: number | null,
) => {
  if (!canCreateSaleFromAppointment(appointment)) {
    return "La cita debe estar completada antes de registrar la venta."
  }
  if (!patientId || appointment.patient_id !== patientId) {
    return "El paciente de la venta debe coincidir con el paciente de la cita."
  }
  return null
}
