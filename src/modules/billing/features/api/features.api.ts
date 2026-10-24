import http from "@/services/http"
import type { 
  Feature, 
  PlanFeature, 
  GetFeaturesParams, 
  PaginatedResponse,
  PlanWithFeatures
} from "../types/features.types"

export const getFeatures = async (params?: GetFeaturesParams): Promise<PaginatedResponse<Feature>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    
    const url = queryParams.toString() ? `/features?${queryParams.toString()}` : '/features'
    const response = await http.get<PaginatedResponse<Feature>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching features:', error)
    throw error
  }
}

export const getFeatureById = async (id: number): Promise<Feature> => {
  try {
    const response = await http.get<Feature>(`/features/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching feature ${id}:`, error)
    throw error
  }
}

export const createFeature = async (data: Omit<Feature, 'id'>): Promise<Feature> => {
  try {
    const response = await http.post<Feature>('/features', data)
    return response.data
  } catch (error) {
    console.error('Error creating feature:', error)
    throw error
  }
}

export const updateFeature = async (id: number, data: Partial<Feature>): Promise<Feature> => {
  try {
    const response = await http.patch<Feature>(`/features/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating feature ${id}:`, error)
    throw error
  }
}

export const deleteFeature = async (id: number): Promise<void> => {
  try {
    await http.delete(`/features/${id}`)
  } catch (error) {
    console.error(`Error deleting feature ${id}:`, error)
    throw error
  }
}

export const getPlanFeatures = async (planId: number): Promise<PlanFeature[]> => {
  try {
    const response = await http.get<PlanFeature[]>(`/plans/${planId}/features/details`)
    console.log('Plan features response:', response.data)
    return response.data
  } catch (error) {
    console.error(`Error fetching plan features for plan ${planId}:`, error)
    throw error
  }
}

export const getPlanFeaturesWithDetails = async (planId: number): Promise<PlanWithFeatures> => {
  try {
    const response = await http.get<PlanWithFeatures>(`/plans/${planId}/features/details`)
    return response.data
  } catch (error) {
    console.error(`Error fetching plan features with details for plan ${planId}:`, error)
    throw error
  }
}

export const assignFeatureToPlan = async (data: Omit<PlanFeature, 'id' | 'feature'>): Promise<PlanFeature> => {
  try {
    const response = await http.post<PlanFeature>('/plan-features', data)
    return response.data
  } catch (error) {
    console.error('Error assigning feature to plan:', error)
    throw error
  }
}

export const removeFeatureFromPlan = async (id: number): Promise<void> => {
  try {
    await http.delete(`/plan-features/${id}`)
  } catch (error) {
    console.error(`Error removing feature from plan ${id}:`, error)
    throw error
  }
}

export const getAvailableFeaturesForPlan = async (planId: number): Promise<Feature[]> => {
  try {
    const response = await http.get<Feature[]>(`/plans/${planId}/available-features`)
    return response.data
  } catch (error) {
    console.error(`Error fetching available features for plan ${planId}:`, error)
    throw error
  }
}

export const getPlansWithFeature = async (featureId: number): Promise<Array<{ plan_id: number; plan_name: string; code: string }>> => {
  try {
    const response = await http.get(`/features/${featureId}/plans`)
    return response.data
  } catch (error) {
    console.error(`Error fetching plans with feature ${featureId}:`, error)
    throw error
  }
}