import http from "@/services/http"
import type {
  DayOfCredit,
  GetDaysOfCreditParams,
  PaginatedResponse,
  CreateDayOfCreditDTO,
  UpdateDayOfCreditDTO,
  DayOfCreditStats
} from "../types/days-of-credit.types"

export const getDaysOfCredit = async (params?: GetDaysOfCreditParams): Promise<PaginatedResponse<DayOfCredit>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    if (params?.company_id) queryParams.append('company_id', String(params.company_id))
    
    const url = queryParams.toString() ? `/days-of-credit?${queryParams.toString()}` : '/days-of-credit'
    const response = await http.get<PaginatedResponse<DayOfCredit>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching days of credit:', error)
    throw error
  }
}

export const getDayOfCreditById = async (id: number): Promise<DayOfCredit> => {
  try {
    const response = await http.get<DayOfCredit>(`/days-of-credit/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching day of credit ${id}:`, error)
    throw error
  }
}

export const createDayOfCredit = async (data: CreateDayOfCreditDTO): Promise<DayOfCredit> => {
  try {
    const response = await http.post<DayOfCredit>('/days-of-credit', data)
    return response.data
  } catch (error) {
    console.error('Error creating day of credit:', error)
    throw error
  }
}

export const updateDayOfCredit = async (id: number, data: UpdateDayOfCreditDTO): Promise<DayOfCredit> => {
  try {
    const response = await http.patch<DayOfCredit>(`/days-of-credit/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating day of credit ${id}:`, error)
    throw error
  }
}

export const deleteDayOfCredit = async (id: number): Promise<void> => {
  try {
    await http.delete(`/days-of-credit/${id}`)
  } catch (error) {
    console.error(`Error deleting day of credit ${id}:`, error)
    throw error
  }
}

export const getDayOfCreditStats = async (): Promise<DayOfCreditStats> => {
  try {
    const response = await http.get<DayOfCreditStats>('/days-of-credit/stats')
    return response.data
  } catch (error) {
    console.error('Error fetching days of credit stats:', error)
    throw error
  }
}