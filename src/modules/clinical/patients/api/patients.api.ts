import http from "@/services/http"
import type { 
  Patient, 
  GetPatientsParams, 
  PaginatedResponse,
  CreatePatientDTO,
  UpdatePatientDTO,
  PatientStats
} from "../types/patients.types"

export const getPatients = async (params?: GetPatientsParams): Promise<PaginatedResponse<Patient>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    if (params?.status !== undefined) queryParams.append('status', String(params.status))
    if (params?.company_id) queryParams.append('company_id', String(params.company_id))
    if (params?.document_type_id) queryParams.append('document_type_id', String(params.document_type_id))
    if (params?.date_from) queryParams.append('date_from', params.date_from)
    if (params?.date_to) queryParams.append('date_to', params.date_to)
    
    const url = queryParams.toString() ? `/patients?${queryParams.toString()}` : '/patients'
    const response = await http.get<PaginatedResponse<Patient>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching patients:', error)
    throw error
  }
}

export const getPatientById = async (id: number): Promise<Patient> => {
  try {
    const response = await http.get<Patient>(`/patients/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching patient ${id}:`, error)
    throw error
  }
}

export const createPatient = async (data: CreatePatientDTO): Promise<Patient> => {
  try {
    const response = await http.post<Patient>('/patients', data)
    return response.data
  } catch (error) {
    console.error('Error creating patient:', error)
    throw error
  }
}

export const updatePatient = async (id: number, data: UpdatePatientDTO): Promise<Patient> => {
  try {
    const response = await http.patch<Patient>(`/patients/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating patient ${id}:`, error)
    throw error
  }
}

export const deletePatient = async (id: number): Promise<void> => {
  try {
    await http.delete(`/patients/${id}`)
  } catch (error) {
    console.error(`Error deleting patient ${id}:`, error)
    throw error
  }
}

export const togglePatientStatus = async (id: number, status: boolean): Promise<Patient> => {
  try {
    const response = await http.patch<Patient>(`/patients/${id}/status`, { status })
    return response.data
  } catch (error) {
    console.error(`Error toggling patient status ${id}:`, error)
    throw error
  }
}

export const getPatientStats = async (companyId?: number): Promise<PatientStats> => {
  try {
    const queryParams = new URLSearchParams()
    if (companyId) queryParams.append('company_id', String(companyId))
    
    const url = queryParams.toString() ? `/patients/stats?${queryParams.toString()}` : '/patients/stats'
    const response = await http.get<PatientStats>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching patient stats:', error)
    throw error
  }
}