import http from '@/services/http'
import type { LaboratoryOrder, LaboratoryOrderDTO, LaboratoryOrderFilters } from '../types/laboratory-orders.types'
import type { PaginatedResponse } from '@/types/global.types'

export const getLaboratoryOrders = async (params: LaboratoryOrderFilters = {}) => {
  const response = await http.get<PaginatedResponse<LaboratoryOrder>>('/laboratory-orders', { params })
  return response.data
}

export const getLaboratoryOrder = async (id: number) => {
  const response = await http.get<LaboratoryOrder>(`/laboratory-orders/${id}`)
  return response.data
}

export const createLaboratoryOrder = async (data: LaboratoryOrderDTO) => {
  const response = await http.post<LaboratoryOrder>('/laboratory-orders', data)
  return response.data
}

export const updateLaboratoryOrder = async (id: number, data: Partial<LaboratoryOrderDTO>) => {
  const response = await http.patch<LaboratoryOrder>(`/laboratory-orders/${id}`, data)
  return response.data
}
