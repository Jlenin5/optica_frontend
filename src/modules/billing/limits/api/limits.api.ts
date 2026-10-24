import http from "@/services/http"
import type { 
  Limit, 
  PlanLimit, 
  GetLimitsParams, 
  PaginatedResponse,
  PlanWithLimits
} from "../types/limits.types"

export const getLimits = async (params?: GetLimitsParams): Promise<PaginatedResponse<Limit>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    
    const url = queryParams.toString() ? `/limits?${queryParams.toString()}` : '/limits'
    const response = await http.get<PaginatedResponse<Limit>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching limits:', error)
    throw error
  }
}

export const getLimitById = async (id: number): Promise<Limit> => {
  try {
    const response = await http.get<Limit>(`/limits/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching limit ${id}:`, error)
    throw error
  }
}

export const createLimit = async (data: Omit<Limit, 'id'>): Promise<Limit> => {
  try {
    const response = await http.post<Limit>('/limits', data)
    return response.data
  } catch (error) {
    console.error('Error creating limit:', error)
    throw error
  }
}

export const updateLimit = async (id: number, data: Partial<Limit>): Promise<Limit> => {
  try {
    const response = await http.patch<Limit>(`/limits/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating limit ${id}:`, error)
    throw error
  }
}

export const deleteLimit = async (id: number): Promise<void> => {
  try {
    await http.delete(`/limits/${id}`)
  } catch (error) {
    console.error(`Error deleting limit ${id}:`, error)
    throw error
  }
}

export const getPlanLimits = async (planId: number): Promise<PlanLimit[]> => {
  try {
    const response = await http.get<PlanLimit[]>(`/plans/${planId}/limits`)
    return response.data
  } catch (error) {
    console.error(`Error fetching plan limits for plan ${planId}:`, error)
    throw error
  }
}

export const getPlanLimitsByPlan = async (planId: number): Promise<PlanLimit[]> => {
  try {
    const response = await http.get<PlanLimit[]>(`/plans/${planId}/limits/details`)
    return response.data
  } catch (error) {
    console.error(`Error fetching plan limits for plan ${planId}:`, error)
    throw error
  }
}

export const assignLimitToPlan = async (data: Omit<PlanLimit, 'id'>): Promise<PlanLimit> => {
  try {
    const response = await http.post<PlanLimit>('/plan-limits', data)
    return response.data
  } catch (error) {
    console.error('Error assigning limit to plan:', error)
    throw error
  }
}

export const updatePlanLimit = async (id: number, value: number | null): Promise<PlanLimit> => {
  try {
    const response = await http.patch<PlanLimit>(`/plan-limits/${id}`, { value })
    return response.data
  } catch (error) {
    console.error(`Error updating plan limit ${id}:`, error)
    throw error
  }
}

export const removePlanLimit = async (id: number): Promise<void> => {
  try {
    await http.delete(`/plan-limits/${id}`)
  } catch (error) {
    console.error(`Error removing plan limit ${id}:`, error)
    throw error
  }
}

export const getAvailableLimitsForPlan = async (planId: number): Promise<Limit[]> => {
  try {
    const response = await http.get<Limit[]>(`/plans/${planId}/available-limits`)
    return response.data
  } catch (error) {
    console.error(`Error fetching available limits for plan ${planId}:`, error)
    throw error
  }
}

export const getPlansWithLimit = async (limitId: number): Promise<Array<PlanWithLimits & { value: number | null; limit_id: number }>> => {
  try {
    const response = await http.get(`/limits/${limitId}/plans`)
    return response.data
  } catch (error) {
    console.error(`Error fetching plans with limit ${limitId}:`, error)
    throw error
  }
}