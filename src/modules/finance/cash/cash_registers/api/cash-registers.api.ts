import http from "@/services/http"
import type {
  CashRegister,
  CashRegisterSession,
  GetCashRegistersParams,
  GetCashRegisterSessionsParams,
  PaginatedResponse,
  CreateCashRegisterDTO,
  UpdateCashRegisterDTO,
  OpenCashRegisterDTO,
  CloseCashRegisterDTO,
  CashRegisterSessionSummary,
  CashRegisterStats,
  CashRegisterSummary
} from "../types/cash-registers.types"

// ============ Cajas Predefinidas ============
export const getCashRegisters = async (params?: GetCashRegistersParams): Promise<PaginatedResponse<CashRegister>> => {
  try {
    const queryParams = new URLSearchParams()
    // if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    if (params?.status !== undefined) queryParams.append('status', String(params.status))
    if (params?.store_id) queryParams.append('store_id', String(params.store_id))
    if (params?.company_id) queryParams.append('company_id', String(params.company_id))
    
    const url = queryParams.toString() ? `/cash-registers?${queryParams.toString()}` : '/cash-registers'
    const response = await http.get<PaginatedResponse<CashRegister>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching cash registers:', error)
    throw error
  }
}

export const getCashRegisterById = async (id: number): Promise<CashRegister> => {
  try {
    const response = await http.get<CashRegister>(`/cash-registers/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching cash register ${id}:`, error)
    throw error
  }
}

export const createCashRegister = async (data: CreateCashRegisterDTO): Promise<CashRegister> => {
  try {
    const response = await http.post<CashRegister>('/cash-registers', data)
    return response.data
  } catch (error) {
    console.error('Error creating cash register:', error)
    throw error
  }
}

export const updateCashRegister = async (id: number, data: UpdateCashRegisterDTO): Promise<CashRegister> => {
  try {
    const response = await http.patch<CashRegister>(`/cash-registers/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating cash register ${id}:`, error)
    throw error
  }
}

export const deleteCashRegister = async (id: number): Promise<void> => {
  try {
    await http.delete(`/cash-registers/${id}`)
  } catch (error) {
    console.error(`Error deleting cash register ${id}:`, error)
    throw error
  }
}

export const getCashRegisterStats = async (companyId?: number): Promise<CashRegisterStats> => {
  try {
    const queryParams = new URLSearchParams()
    if (companyId) queryParams.append('company_id', String(companyId))
    
    const url = queryParams.toString() ? `/cash-registers/stats?${queryParams.toString()}` : '/cash-registers/stats'
    const response = await http.get<CashRegisterStats>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching cash register stats:', error)
    throw error
  }
}

// ============ Sesiones de Caja ============
export const getCashRegisterSessions = async (params?: GetCashRegisterSessionsParams): Promise<PaginatedResponse<CashRegisterSession>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.cash_register_id) queryParams.append('cash_register_id', String(params.cash_register_id))
    if (params?.user_id) queryParams.append('user_id', String(params.user_id))
    if (params?.status) queryParams.append('status', params.status)
    if (params?.date_from) queryParams.append('date_from', params.date_from)
    if (params?.date_to) queryParams.append('date_to', params.date_to)
    
    const url = queryParams.toString() ? `/cash-register-sessions?${queryParams.toString()}` : '/cash-register-sessions'
    const response = await http.get<PaginatedResponse<CashRegisterSession>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching cash register sessions:', error)
    throw error
  }
}

export const getActiveSession = async (): Promise<CashRegisterSession | null> => {
  try {
    const response = await http.get<CashRegisterSession>('/cash-register-sessions/active')
    return response.data
  } catch (error: any) {
    // Si es 404, retornamos null silenciosamente
    if (error.response?.status === 404) {
      return null
    }
    // Para otros errores, sí los mostramos
    console.error('Error fetching active session:', error)
    throw error
  }
}

export const openCashRegister = async (data: OpenCashRegisterDTO): Promise<CashRegisterSession> => {
  try {
    const response = await http.post<CashRegisterSession>('/cash-register-sessions/open', data)
    return response.data
  } catch (error) {
    console.error('Error opening cash register:', error)
    throw error
  }
}

export const getCashRegisterSummary = async (id: number): Promise<CashRegisterSummary> => {
  try {
    const response = await http.get<CashRegisterSummary>(`/cash-registers/${id}/summary`)
    return response.data
  } catch (error) {
    console.error(`Error fetching cash register summary ${id}:`, error)
    throw error
  }
}

export const closeCashRegister = async (id: number, data: CloseCashRegisterDTO): Promise<CashRegisterSession> => {
  try {
    const response = await http.post<CashRegisterSession>(`/cash-register-sessions/${id}/close`, data)
    return response.data
  } catch (error) {
    console.error(`Error closing cash register session ${id}:`, error)
    throw error
  }
}

export const closeCashRegisterSession = async (id: number, data: CloseCashRegisterDTO): Promise<CashRegisterSession> => {
  try {
    const response = await http.post<CashRegisterSession>(`/cash-register-sessions/${id}/close`, data)
    return response.data
  } catch (error) {
    console.error(`Error closing cash register session ${id}:`, error)
    throw error
  }
}

export const getCashRegisterSessionSummary = async (id: number): Promise<CashRegisterSessionSummary> => {
  try {
    const response = await http.get<CashRegisterSessionSummary>(`/cash-register-sessions/${id}/summary`)
    return response.data
  } catch (error) {
    console.error(`Error fetching session summary ${id}:`, error)
    throw error
  }
}