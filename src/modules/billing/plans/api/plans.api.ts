import http from "@/services/http"
import type { 
  Plan, 
  GetPlansParams,
  PlanStats
} from "../types/plans.types"
import type { PaginatedResponse } from "@/types/global.types"

export const getPlans = async (params?: GetPlansParams): Promise<PaginatedResponse<Plan>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    if (params?.status !== undefined) queryParams.append('status', String(params.status))
    
    const url = queryParams.toString() ? `/plans?${queryParams.toString()}` : '/plans'
    const response = await http.get<PaginatedResponse<Plan>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching plans:', error)
    throw error
  }
}

export const getPlanById = async (id: number): Promise<Plan> => {
  try {
    const response = await http.get<Plan>(`/plans/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching plan ${id}:`, error)
    throw error
  }
}

export const createPlan = async (data: Plan): Promise<Plan> => {
  try {
    const response = await http.post<Plan>('/plans', data)
    return response.data
  } catch (error) {
    console.error('Error creating plan:', error)
    throw error
  }
}

export const updatePlan = async (id: number, data: Plan): Promise<Plan> => {
  try {
    const response = await http.patch<Plan>(`/plans/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating plan ${id}:`, error)
    throw error
  }
}

export const deletePlan = async (id: number): Promise<void> => {
  try {
    await http.delete(`/plans/${id}`)
  } catch (error) {
    console.error(`Error deleting plan ${id}:`, error)
    throw error
  }
}

export const togglePlanStatus = async (id: number, status: boolean): Promise<Plan> => {
  try {
    const response = await http.patch<Plan>(`/plans/${id}/status`, { status })
    return response.data
  } catch (error) {
    console.error(`Error toggling plan status ${id}:`, error)
    throw error
  }
}

export const togglePlanVisibility = async (id: number, is_public: boolean): Promise<Plan> => {
  try {
    const response = await http.patch<Plan>(`/plans/${id}/visibility`, { is_public })
    return response.data
  } catch (error) {
    console.error(`Error toggling plan visibility ${id}:`, error)
    throw error
  }
}

export const getPlanStats = async (): Promise<PlanStats> => {
  try {
    const response = await http.get<PlanStats>('/plans/stats')
    return response.data
  } catch (error) {
    console.error('Error fetching plan stats:', error)
    throw error
  }
}