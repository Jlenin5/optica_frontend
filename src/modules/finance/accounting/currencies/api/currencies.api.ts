import http from "@/services/http"
import type {
  Currency,
  GetCurrenciesParams,
  PaginatedResponse,
  CreateCurrencyDTO,
  UpdateCurrencyDTO,
  CurrencyStats
} from "../types/currencies.types"

export const getCurrencies = async (params?: GetCurrenciesParams): Promise<PaginatedResponse<Currency>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    
    const url = queryParams.toString() ? `/currencies?${queryParams.toString()}` : '/currencies'
    const response = await http.get<PaginatedResponse<Currency>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching currencies:', error)
    throw error
  }
}

export const getCurrencyById = async (id: number): Promise<Currency> => {
  try {
    const response = await http.get<Currency>(`/currencies/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching currency ${id}:`, error)
    throw error
  }
}

export const createCurrency = async (data: CreateCurrencyDTO): Promise<Currency> => {
  try {
    const response = await http.post<Currency>('/currencies', data)
    return response.data
  } catch (error) {
    console.error('Error creating currency:', error)
    throw error
  }
}

export const updateCurrency = async (id: number, data: UpdateCurrencyDTO): Promise<Currency> => {
  try {
    const response = await http.patch<Currency>(`/currencies/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating currency ${id}:`, error)
    throw error
  }
}

export const deleteCurrency = async (id: number): Promise<void> => {
  try {
    await http.delete(`/currencies/${id}`)
  } catch (error) {
    console.error(`Error deleting currency ${id}:`, error)
    throw error
  }
}

export const getCurrencyStats = async (): Promise<CurrencyStats> => {
  try {
    const response = await http.get<CurrencyStats>('/currencies/stats')
    return response.data
  } catch (error) {
    console.error('Error fetching currency stats:', error)
    throw error
  }
}