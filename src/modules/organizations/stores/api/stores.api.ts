import http from "@/services/http"
import type { 
  Store, 
  GetStoresParams, 
  PaginatedResponse,
  CreateStoreDTO,
  UpdateStoreDTO,
  StoreStats
} from "../types/stores.types"

export const getStores = async (params?: GetStoresParams): Promise<PaginatedResponse<Store>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    if (params?.status !== undefined) queryParams.append('status', String(params.status))
    if (params?.branch_office_id) queryParams.append('branch_office_id', String(params.branch_office_id))
    if (params?.company_id) queryParams.append('company_id', String(params.company_id))
    
    const url = queryParams.toString() ? `/stores?${queryParams.toString()}` : '/stores'
    const response = await http.get<PaginatedResponse<Store>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching stores:', error)
    throw error
  }
}

export const getStoreById = async (id: number): Promise<Store> => {
  try {
    const response = await http.get<Store>(`/stores/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching store ${id}:`, error)
    throw error
  }
}

export const createStore = async (data: CreateStoreDTO): Promise<Store> => {
  try {
    const response = await http.post<Store>('/stores', data)
    return response.data
  } catch (error) {
    console.error('Error creating store:', error)
    throw error
  }
}

export const updateStore = async (id: number, data: UpdateStoreDTO): Promise<Store> => {
  try {
    const response = await http.patch<Store>(`/stores/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating store ${id}:`, error)
    throw error
  }
}

export const deleteStore = async (id: number): Promise<void> => {
  try {
    await http.delete(`/stores/${id}`)
  } catch (error) {
    console.error(`Error deleting store ${id}:`, error)
    throw error
  }
}

export const toggleStoreStatus = async (id: number, status: boolean): Promise<Store> => {
  try {
    const response = await http.patch<Store>(`/stores/${id}/status`, { status })
    return response.data
  } catch (error) {
    console.error(`Error toggling store status ${id}:`, error)
    throw error
  }
}

export const getStoreStats = async (companyId?: number): Promise<StoreStats> => {
  try {
    const queryParams = new URLSearchParams()
    if (companyId) queryParams.append('company_id', String(companyId))
    
    const url = queryParams.toString() ? `/stores/stats?${queryParams.toString()}` : '/stores/stats'
    const response = await http.get<StoreStats>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching store stats:', error)
    throw error
  }
}