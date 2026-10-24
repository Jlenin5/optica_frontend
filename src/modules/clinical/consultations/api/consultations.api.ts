import http from "@/services/http"
import type {
  Consultation
} from "../types/consultations.types"

// NOTA: URL provisional siguiendo el patrón REST existente. Ajustar cuando
// se confirmen las rutas reales del backend.
const BASE_URL = '/consultations'

export const consultationsApi = {
  // Listar consultas con filtros
  getList: (params?: {
    search?: string
    medical_record_id?: number
    patient_id?: number
    appointment_id?: number
    status?: string
    page?: number
    page_size?: number
  }) => {
    return http.get<Consultation>(`${BASE_URL}/`, { params })
  },

  // Obtener detalle de una consulta
  getDetail: async (id: number): Promise<Consultation> => {
    const response = await http.get<Consultation>(`${BASE_URL}/${id}/`)
    return response.data
  },

  // Crear consulta
  create: async (data: Consultation): Promise<Consultation> => {
    const response = await http.post<Consultation>(`${BASE_URL}/`, data)
    return response.data
  },

  // Actualizar consulta
  update: async (id: number, data: Consultation): Promise<Consultation> => {
    const response = await http.put<Consultation>(`${BASE_URL}/${id}/`, data)
    return response.data
  },

  // Actualización parcial
  partialUpdate: async (id: number, data: Consultation): Promise<Consultation> => {
    const response = await http.patch<Consultation>(`${BASE_URL}/${id}/`, data)
    return response.data
  },

  // Eliminar (soft delete)
  delete: (id: number) => {
    return http.delete(`${BASE_URL}/${id}/`)
  }
}
