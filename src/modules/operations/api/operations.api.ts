import http from '@/services/http'
import type { PaginatedResponse } from '@/types/global.types'
import type { Delivery, DeliveryDTO, OperationFilters, Repair, RepairDTO } from '../types/operations.types'

export const getRepairs = async (params: OperationFilters = {}) => (await http.get<PaginatedResponse<Repair>>('/repairs', { params })).data
export const createRepair = async (data: RepairDTO) => (await http.post<Repair>('/repairs', data)).data
export const updateRepair = async (id: number, data: Partial<RepairDTO>) => (await http.patch<Repair>(`/repairs/${id}`, data)).data
export const deleteRepair = async (id: number) => { await http.delete(`/repairs/${id}`) }

export const getDeliveries = async (params: OperationFilters = {}) => (await http.get<PaginatedResponse<Delivery>>('/deliveries', { params })).data
export const createDelivery = async (data: DeliveryDTO) => (await http.post<Delivery>('/deliveries', data)).data
export const updateDelivery = async (id: number, data: Partial<DeliveryDTO>) => (await http.patch<Delivery>(`/deliveries/${id}`, data)).data
export const deleteDelivery = async (id: number) => { await http.delete(`/deliveries/${id}`) }
