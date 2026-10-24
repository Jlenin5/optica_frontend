import http from "@/services/http"
import type {
  ExchangeRate,
  GetExchangeRatesParams,
  PaginatedResponse,
  CreateExchangeRateDTO,
  UpdateExchangeRateDTO,
  ExchangeRateStats
} from "../types/exchange-rates.types"

export const getExchangeRates = async (params?: GetExchangeRatesParams): Promise<PaginatedResponse<ExchangeRate>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.date_from) queryParams.append('date_from', params.date_from)
    if (params?.date_to) queryParams.append('date_to', params.date_to)
    if (params?.company_id) queryParams.append('company_id', String(params.company_id))
    
    const url = queryParams.toString() ? `/exchange-rates?${queryParams.toString()}` : '/exchange-rates'
    const response = await http.get<PaginatedResponse<ExchangeRate>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching exchange rates:', error)
    throw error
  }
}

export const getLatestExchangeRate = async (): Promise<ExchangeRate> => {
  try {
    const response = await http.get<ExchangeRate>('/exchange-rates/latest')
    return response.data
  } catch (error) {
    console.error('Error fetching latest exchange rate:', error)
    throw error
  }
}

export const getExchangeRateById = async (id: number): Promise<ExchangeRate> => {
  try {
    const response = await http.get<ExchangeRate>(`/exchange-rates/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching exchange rate ${id}:`, error)
    throw error
  }
}

export const createExchangeRate = async (data: CreateExchangeRateDTO): Promise<ExchangeRate> => {
  try {
    const response = await http.post<ExchangeRate>('/exchange-rates', data)
    return response.data
  } catch (error) {
    console.error('Error creating exchange rate:', error)
    throw error
  }
}

export const updateExchangeRate = async (id: number, data: UpdateExchangeRateDTO): Promise<ExchangeRate> => {
  try {
    const response = await http.patch<ExchangeRate>(`/exchange-rates/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating exchange rate ${id}:`, error)
    throw error
  }
}

export const getExchangeRateStats = async (): Promise<ExchangeRateStats> => {
  try {
    const response = await http.get<ExchangeRateStats>('/exchange-rates/stats')
    return response.data
  } catch (error) {
    console.error('Error fetching exchange rate stats:', error)
    throw error
  }
}