import http from "@/services/http"
import type { 
  Appointment, 
  GetAppointmentsParams, 
  PaginatedResponse,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
  AppointmentStats,
  CalendarEvent
} from "../types/appointments.types"

export const getAppointments = async (params?: GetAppointmentsParams): Promise<PaginatedResponse<Appointment>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    if (params?.status !== undefined) queryParams.append('status', String(params.status))
    if (params?.patient_id) queryParams.append('patient_id', String(params.patient_id))
    if (params?.optometrist_id) queryParams.append('optometrist_id', String(params.optometrist_id))
    if (params?.date_from) queryParams.append('date_from', params.date_from)
    if (params?.date_to) queryParams.append('date_to', params.date_to)
    if (params?.date) queryParams.append('date', params.date)
    if (params?.company_id) queryParams.append('company_id', String(params.company_id))
    
    const url = queryParams.toString() ? `/appointments?${queryParams.toString()}` : '/appointments'
    const response = await http.get<PaginatedResponse<Appointment>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching appointments:', error)
    throw error
  }
}

export const getAppointmentById = async (id: number): Promise<Appointment> => {
  try {
    const response = await http.get<Appointment>(`/appointments/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching appointment ${id}:`, error)
    throw error
  }
}

export const createAppointment = async (data: CreateAppointmentDTO): Promise<Appointment> => {
  try {
    const response = await http.post<Appointment>('/appointments', data)
    return response.data
  } catch (error) {
    console.error('Error creating appointment:', error)
    throw error
  }
}

export const updateAppointment = async (id: number, data: UpdateAppointmentDTO): Promise<Appointment> => {
  try {
    const response = await http.patch<Appointment>(`/appointments/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating appointment ${id}:`, error)
    throw error
  }
}

export const deleteAppointment = async (id: number): Promise<void> => {
  try {
    await http.delete(`/appointments/${id}`)
  } catch (error) {
    console.error(`Error deleting appointment ${id}:`, error)
    throw error
  }
}

export const toggleAppointmentStatus = async (id: number, status: boolean): Promise<Appointment> => {
  try {
    const response = await http.patch<Appointment>(`/appointments/${id}/status`, { status })
    return response.data
  } catch (error) {
    console.error(`Error toggling appointment status ${id}:`, error)
    throw error
  }
}

export const getAppointmentStats = async (): Promise<AppointmentStats> => {
  try {
    const response = await http.get<AppointmentStats>('/appointments/stats')
    return response.data
  } catch (error) {
    console.error('Error fetching appointment stats:', error)
    throw error
  }
}

export const getCalendarEvents = async (start: string, end: string): Promise<CalendarEvent[]> => {
  try {
    const response = await http.get<CalendarEvent[]>(`/appointments/calendar?start=${start}&end=${end}`)
    return response.data
  } catch (error) {
    console.error('Error fetching calendar events:', error)
    throw error
  }
}

// Vincula una consulta clínica (Consultation) ya existente a la cita.
// La prescripción NO se vincula directamente a la cita: se accede a través de
// appointment.consultation.prescription (Consultation 1:1 Prescription).
export const linkConsultationToAppointment = async (appointmentId: number, consultationId: number): Promise<Appointment> => {
  try {
    const response = await http.post<Appointment>(`/appointments/${appointmentId}/consultation`, { consultation_id: consultationId })
    return response.data
  } catch (error) {
    console.error(`Error linking consultation to appointment ${appointmentId}:`, error)
    throw error
  }
}

export const unlinkConsultationFromAppointment = async (appointmentId: number): Promise<Appointment> => {
  try {
    const response = await http.delete<Appointment>(`/appointments/${appointmentId}/consultation`)
    return response.data
  } catch (error) {
    console.error(`Error unlinking consultation from appointment ${appointmentId}:`, error)
    throw error
  }
}