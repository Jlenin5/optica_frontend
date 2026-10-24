import http from "@/services/http"
import type {
  MedicalRecord,
  CreateMedicalRecordDTO,
  UpdateMedicalRecordDTO
} from "../types/medical_records.types"

// NOTA: URLs provisionales siguiendo el patrón REST del resto del proyecto
// (/patients, /prescriptions, etc). Ajustar si el backend expone rutas distintas.
const BASE_URL = "/medical-records"

// Un paciente tiene como máximo un historial clínico (Patient 1:1 MedicalRecord).
// Se filtra por patient_id y se toma el primer (único) resultado.
export const getMedicalRecordByPatientId = async (patientId: number): Promise<MedicalRecord | null> => {
  try {
    const response = await http.get<{ results: MedicalRecord[] } | MedicalRecord[]>(`${BASE_URL}/`, {
      params: { patient_id: patientId }
    })
    const data = response.data as any
    const results: MedicalRecord[] = Array.isArray(data) ? data : data?.results || []
    return results[0] || null
  } catch (error: any) {
    if (error?.response?.status === 404) return null
    console.error(`Error fetching medical record for patient ${patientId}:`, error)
    throw error
  }
}

export const getMedicalRecordById = async (id: number): Promise<MedicalRecord> => {
  try {
    const response = await http.get<MedicalRecord>(`${BASE_URL}/${id}/`)
    return response.data
  } catch (error) {
    console.error(`Error fetching medical record ${id}:`, error)
    throw error
  }
}

export const createMedicalRecord = async (data: CreateMedicalRecordDTO): Promise<MedicalRecord> => {
  try {
    const response = await http.post<MedicalRecord>(`${BASE_URL}/`, data)
    return response.data
  } catch (error) {
    console.error("Error creating medical record:", error)
    throw error
  }
}

export const updateMedicalRecord = async (id: number, data: UpdateMedicalRecordDTO): Promise<MedicalRecord> => {
  try {
    const response = await http.patch<MedicalRecord>(`${BASE_URL}/${id}/`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating medical record ${id}:`, error)
    throw error
  }
}

// Eliminación lógica (soft delete)
export const deleteMedicalRecord = async (id: number): Promise<void> => {
  try {
    await http.delete(`${BASE_URL}/${id}/`)
  } catch (error) {
    console.error(`Error deleting medical record ${id}:`, error)
    throw error
  }
}
