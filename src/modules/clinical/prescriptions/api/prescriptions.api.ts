import http from "@/services/http"
import type {
  Prescription,
  GetPrescriptionsParams,
  PaginatedResponse,
  CreatePrescriptionDTO,
  UpdatePrescriptionDTO,
  PrescriptionStats
} from "../types/prescriptions.types"

export const getPrescriptions = async (params?: GetPrescriptionsParams): Promise<PaginatedResponse<Prescription>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    if (params?.status !== undefined) queryParams.append('status', String(params.status))
    if (params?.patient_id) queryParams.append('patient_id', String(params.patient_id))
    if (params?.consultation_id) queryParams.append('consultation_id', String(params.consultation_id))
    if (params?.source_type) queryParams.append('source_type', params.source_type)
    if (params?.date_from) queryParams.append('date_from', params.date_from)
    if (params?.date_to) queryParams.append('date_to', params.date_to)
    
    const url = queryParams.toString() ? `/prescriptions?${queryParams.toString()}` : '/prescriptions'
    const response = await http.get<PaginatedResponse<Prescription>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching prescriptions:', error)
    throw error
  }
}

export const getPrescriptionById = async (id: number): Promise<Prescription> => {
  try {
    const response = await http.get<Prescription>(`/prescriptions/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching prescription ${id}:`, error)
    throw error
  }
}

export const createPrescription = async (data: CreatePrescriptionDTO): Promise<Prescription> => {
  try {
    const response = await http.post<Prescription>('/prescriptions', data)
    return response.data
  } catch (error) {
    console.error('Error creating prescription:', error)
    throw error
  }
}

export const updatePrescription = async (id: number, data: UpdatePrescriptionDTO): Promise<Prescription> => {
  try {
    const response = await http.patch<Prescription>(`/prescriptions/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating prescription ${id}:`, error)
    throw error
  }
}

export const deletePrescription = async (id: number): Promise<void> => {
  try {
    await http.delete(`/prescriptions/${id}`)
  } catch (error) {
    console.error(`Error deleting prescription ${id}:`, error)
    throw error
  }
}

export const togglePrescriptionStatus = async (id: number, status: boolean): Promise<Prescription> => {
  try {
    const response = await http.patch<Prescription>(`/prescriptions/${id}/status`, { status })
    return response.data
  } catch (error) {
    console.error(`Error toggling prescription status ${id}:`, error)
    throw error
  }
}

export const getPrescriptionStats = async (companyId?: number): Promise<PrescriptionStats> => {
  try {
    const queryParams = new URLSearchParams()
    if (companyId) queryParams.append('company_id', String(companyId))
    
    const url = queryParams.toString() ? `/prescriptions/stats?${queryParams.toString()}` : '/prescriptions/stats'
    const response = await http.get<PrescriptionStats>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching prescription stats:', error)
    throw error
  }
}

// Historial de prescripciones de un paciente, a través de sus consultas
// (Patient 1:1 MedicalRecord 1:N Consultation 1:1 Prescription). El backend
// resuelve el join patient_id -> medical_record -> consultations -> prescription.
export const getPatientPrescriptions = async (patientId: number): Promise<Prescription[]> => {
  try {
    const response = await http.get<Prescription[]>(`/patients/${patientId}/prescriptions`)
    return response.data
  } catch (error) {
    console.error(`Error fetching prescriptions for patient ${patientId}:`, error)
    throw error
  }
}

// Prescripción asociada a una consulta específica (relación 1:1)
export const getPrescriptionByConsultationId = async (consultationId: number): Promise<Prescription | null> => {
  try {
    const response = await http.get<Prescription>(`/consultations/${consultationId}/prescription`)
    return response.data
  } catch (error: any) {
    if (error?.response?.status === 404) return null
    console.error(`Error fetching prescription for consultation ${consultationId}:`, error)
    throw error
  }
}