import http from "@/services/http"
import type {
  CashMovement,
  GetCashMovementsParams,
  PaginatedResponse,
  CreateCashMovementDTO,
  UpdateCashMovementDTO,
  CashMovementStats
} from "../types/cash-movements.types"

export const getCashMovements = async (params?: GetCashMovementsParams): Promise<PaginatedResponse<CashMovement>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    if (params?.movement_type) queryParams.append('movement_type', params.movement_type)
    if (params?.source) queryParams.append('source', params.source)
    if (params?.cash_register_id) queryParams.append('cash_register_id', String(params.cash_register_id))
    if (params?.payment_method_id) queryParams.append('payment_method_id', String(params.payment_method_id))
    if (params?.date_from) queryParams.append('date_from', params.date_from)
    if (params?.date_to) queryParams.append('date_to', params.date_to)
    if (params?.company_id) queryParams.append('company_id', String(params.company_id))
    
    const url = queryParams.toString() ? `/cash-movements?${queryParams.toString()}` : '/cash-movements'
    const response = await http.get<PaginatedResponse<CashMovement>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching cash movements:', error)
    throw error
  }
}

export const getCashMovementById = async (id: number): Promise<CashMovement> => {
  try {
    const response = await http.get<CashMovement>(`/cash-movements/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching cash movement ${id}:`, error)
    throw error
  }
}

export const createCashMovement = async (data: CreateCashMovementDTO): Promise<CashMovement> => {
  try {
    const response = await http.post<CashMovement>('/cash-movements', data)
    return response.data
  } catch (error) {
    console.error('Error creating cash movement:', error)
    throw error
  }
}

export const updateCashMovement = async (id: number, data: UpdateCashMovementDTO): Promise<CashMovement> => {
  try {
    const response = await http.patch<CashMovement>(`/cash-movements/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating cash movement ${id}:`, error)
    throw error
  }
}

export const deleteCashMovement = async (id: number): Promise<void> => {
  try {
    await http.delete(`/cash-movements/${id}`)
  } catch (error) {
    console.error(`Error deleting cash movement ${id}:`, error)
    throw error
  }
}

export const getCashMovementStats = async (cashRegisterId?: number): Promise<CashMovementStats> => {
  try {
    console.log(cashRegisterId)
    const queryParams = new URLSearchParams()
    if (cashRegisterId) queryParams.append('cash_register_id', String(cashRegisterId))
    
    const url = queryParams.toString() ? `/cash-movements/stats` : '/cash-movements/stats'
    const response = await http.get<CashMovementStats>(url)
    return response.data
  } catch (error) {
    console.log(cashRegisterId)
    console.error('Error fetching cash movement stats:', error)
    throw error
  }
}

export const getMovementsByRegister = async (registerId: number): Promise<CashMovement[]> => {
  try {
    const response = await http.get<CashMovement[]>(`/cash-movements/by-register/${registerId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching movements for register ${registerId}:`, error)
    throw error
  }
}