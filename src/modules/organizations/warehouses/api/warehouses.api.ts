import http from "@/services/http"
import type { 
  Warehouse, 
  GetWarehousesParams, 
  PaginatedResponse,
  CreateWarehouseDTO,
  UpdateWarehouseDTO,
  WarehouseStats
} from "../types/warehouses.types"

export const getWarehouses = async (params?: GetWarehousesParams): Promise<PaginatedResponse<Warehouse>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    if (params?.status !== undefined) queryParams.append('status', String(params.status))
    if (params?.company_id) queryParams.append('company_id', String(params.company_id))
    if (params?.branch_office_id) queryParams.append('branch_office_id', String(params.branch_office_id))
    if (params?.type) queryParams.append('type', params.type)
    
    const url = queryParams.toString() ? `/warehouses?${queryParams.toString()}` : '/warehouses'
    const response = await http.get<PaginatedResponse<Warehouse>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching warehouses:', error)
    throw error
  }
}

export const getWarehouseById = async (id: number): Promise<Warehouse> => {
  try {
    const response = await http.get<Warehouse>(`/warehouses/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching warehouse ${id}:`, error)
    throw error
  }
}

export const createWarehouse = async (data: CreateWarehouseDTO): Promise<Warehouse> => {
  try {
    const response = await http.post<Warehouse>('/warehouses', data)
    return response.data
  } catch (error) {
    console.error('Error creating warehouse:', error)
    throw error
  }
}

export const updateWarehouse = async (id: number, data: UpdateWarehouseDTO): Promise<Warehouse> => {
  try {
    const response = await http.patch<Warehouse>(`/warehouses/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating warehouse ${id}:`, error)
    throw error
  }
}

export const deleteWarehouse = async (id: number): Promise<void> => {
  try {
    await http.delete(`/warehouses/${id}`)
  } catch (error) {
    console.error(`Error deleting warehouse ${id}:`, error)
    throw error
  }
}

export const toggleWarehouseStatus = async (id: number, status: boolean): Promise<Warehouse> => {
  try {
    const response = await http.patch<Warehouse>(`/warehouses/${id}/status`, { status })
    return response.data
  } catch (error) {
    console.error(`Error toggling warehouse status ${id}:`, error)
    throw error
  }
}

export const getWarehouseStats = async (companyId?: number): Promise<WarehouseStats> => {
  try {
    const queryParams = new URLSearchParams()
    if (companyId) queryParams.append('company_id', String(companyId))
    
    const url = queryParams.toString() ? `/warehouses/stats?${queryParams.toString()}` : '/warehouses/stats'
    const response = await http.get<WarehouseStats>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching warehouse stats:', error)
    throw error
  }
}