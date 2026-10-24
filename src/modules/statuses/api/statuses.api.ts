import http from "@/services/http"
import type {
  GetStatusesParams,
  Status,
  CreateStatusDTO,
  UpdateStatusDTO,
  StatusStats,
} from "../types/statuses.types"
import type { PaginatedResponse } from "@/types/global.types"

export const getStatuses = async (params?: GetStatusesParams): Promise<PaginatedResponse<Status>> => {
  try {
    const response = await http.get<PaginatedResponse<Status>>('/statuses', {
      params: {
        limit: params?.limit || 10,
        offset: params?.offset || 0,
        search: params?.search || undefined,
        is_default: params?.is_default,
        status: params?.status,
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching statuses:', error)
    throw error
  }
}

export const getStatusById = async (id: number): Promise<Status> => {
  try {
    const response = await http.get<Status>(`/statuses/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching status ${id}:`, error)
    throw error
  }
}

export const createStatus = async (data: CreateStatusDTO): Promise<Status> => {
  try {
    const response = await http.post<Status>('/statuses', data)
    return response.data
  } catch (error) {
    console.error('Error creating status:', error)
    throw error
  }
}

export const updateStatus = async (id: number, data: UpdateStatusDTO): Promise<Status> => {
  try {
    const response = await http.patch<Status>(`/statuses/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating status ${id}:`, error)
    throw error
  }
}

export const deleteStatus = async (id: number): Promise<void> => {
  try {
    await http.delete(`/statuses/${id}`)
  } catch (error) {
    console.error(`Error deleting status ${id}:`, error)
    throw error
  }
}

/**
 * El backend no expone un endpoint dedicado `/statuses/{id}/is-default`;
 * el cambio de `is_default` se hace vía PATCH estándar sobre el recurso,
 * igual que cualquier otra actualización parcial.
 */
export const toggleStatusDefault = async (id: number, is_default: boolean): Promise<Status> => {
  try {
    const response = await http.patch<Status>(`/statuses/${id}`, { is_default })
    return response.data
  } catch (error) {
    console.error(`Error toggling status ${id}:`, error)
    throw error
  }
}

export const getStatusStats = async (): Promise<StatusStats> => {
  try {
    const response = await http.get<StatusStats>('/statuses/stats')
    return response.data
  } catch (error) {
    console.error('Error fetching status stats:', error)
    throw error
  }
}
