import http from "@/services/http"
import type { 
  BranchOffice, 
  GetBranchOfficesParams, 
  PaginatedResponse,
  CreateBranchOfficeDTO,
  UpdateBranchOfficeDTO,
  BranchOfficeStats
} from "../types/branch-offices.types"

export const getBranchOffices = async (params?: GetBranchOfficesParams): Promise<PaginatedResponse<BranchOffice>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    if (params?.status !== undefined) queryParams.append('status', String(params.status))
    if (params?.company_id) queryParams.append('company_id', String(params.company_id))
    
    const url = queryParams.toString() ? `/branch-offices?${queryParams.toString()}` : '/branch-offices'
    const response = await http.get<PaginatedResponse<BranchOffice>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching branch offices:', error)
    throw error
  }
}

export const getBranchOfficeById = async (id: number): Promise<BranchOffice> => {
  try {
    const response = await http.get<BranchOffice>(`/branch-offices/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching branch office ${id}:`, error)
    throw error
  }
}

export const createBranchOffice = async (data: CreateBranchOfficeDTO): Promise<BranchOffice> => {
  try {
    const response = await http.post<BranchOffice>('/branch-offices', data)
    return response.data
  } catch (error) {
    console.error('Error creating branch office:', error)
    throw error
  }
}

export const updateBranchOffice = async (id: number, data: UpdateBranchOfficeDTO): Promise<BranchOffice> => {
  try {
    const response = await http.patch<BranchOffice>(`/branch-offices/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating branch office ${id}:`, error)
    throw error
  }
}

export const deleteBranchOffice = async (id: number): Promise<void> => {
  try {
    await http.delete(`/branch-offices/${id}`)
  } catch (error) {
    console.error(`Error deleting branch office ${id}:`, error)
    throw error
  }
}

export const toggleBranchOfficeStatus = async (id: number, status: boolean): Promise<BranchOffice> => {
  try {
    const response = await http.patch<BranchOffice>(`/branch-offices/${id}/status`, { status })
    return response.data
  } catch (error) {
    console.error(`Error toggling branch office status ${id}:`, error)
    throw error
  }
}

export const getBranchOfficeStats = async (companyId?: number): Promise<BranchOfficeStats> => {
  try {
    const queryParams = new URLSearchParams()
    if (companyId) queryParams.append('company_id', String(companyId))
    
    const url = queryParams.toString() ? `/branch-offices/stats?${queryParams.toString()}` : '/branch-offices/stats'
    const response = await http.get<BranchOfficeStats>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching branch office stats:', error)
    throw error
  }
}