import http from '@/services/http'
import type { Service, ServiceDTO, ServiceFilters } from '../types/services.types'
import type { PaginatedResponse } from '@/types/global.types'

export const getServices = async (params: ServiceFilters = {}) => {
  const response = await http.get<PaginatedResponse<Service>>('/services', { params })
  return response.data
}

export const getService = async (id: number) => {
  const response = await http.get<Service>(`/services/${id}`)
  return response.data
}

export const createService = async (data: ServiceDTO) => {
  const response = await http.post<Service>('/services', data)
  return response.data
}

export const updateService = async (id: number, data: Partial<ServiceDTO>) => {
  const response = await http.patch<Service>(`/services/${id}`, data)
  return response.data
}

export const deleteService = async (id: number) => {
  await http.delete(`/services/${id}`)
}
