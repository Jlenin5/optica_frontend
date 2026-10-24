import http from "@/services/http"
import type { 
  Subscription, 
  GetSubscriptionsParams,
  CreateSubscriptionDTO,
  UpdateSubscriptionDTO,
  SubscriptionStats
} from "../types/subscriptions.types"
import type { PaginatedResponse } from "@/types/global.types"

export const getSubscriptions = async (params?: GetSubscriptionsParams): Promise<PaginatedResponse<Subscription>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    if (params?.status) queryParams.append('status', params.status)
    if (params?.company_id) queryParams.append('company_id', String(params.company_id))
    if (params?.plan_id) queryParams.append('plan_id', String(params.plan_id))
    
    const url = queryParams.toString() ? `/subscriptions?${queryParams.toString()}` : '/subscriptions'
    const response = await http.get<PaginatedResponse<Subscription>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    throw error
  }
}

export const getSubscriptionById = async (id: number): Promise<Subscription> => {
  try {
    const response = await http.get<Subscription>(`/subscriptions/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching subscription ${id}:`, error)
    throw error
  }
}

export const createSubscription = async (data: CreateSubscriptionDTO): Promise<Subscription> => {
  try {
    const response = await http.post<Subscription>('/subscriptions', data)
    return response.data
  } catch (error) {
    console.error('Error creating subscription:', error)
    throw error
  }
}

export const updateSubscription = async (id: number, data: UpdateSubscriptionDTO): Promise<Subscription> => {
  try {
    const response = await http.patch<Subscription>(`/subscriptions/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating subscription ${id}:`, error)
    throw error
  }
}

export const cancelSubscription = async (id: number): Promise<Subscription> => {
  try {
    const response = await http.post<Subscription>(`/subscriptions/${id}/cancel`)
    return response.data
  } catch (error) {
    console.error(`Error canceling subscription ${id}:`, error)
    throw error
  }
}

export const renewSubscription = async (id: number): Promise<Subscription> => {
  try {
    const response = await http.post<Subscription>(`/subscriptions/${id}/renew`)
    return response.data
  } catch (error) {
    console.error(`Error renewing subscription ${id}:`, error)
    throw error
  }
}

export const getSubscriptionStats = async (): Promise<SubscriptionStats> => {
  try {
    const response = await http.get<SubscriptionStats>('/subscriptions/stats')
    return response.data
  } catch (error) {
    console.error('Error fetching subscription stats:', error)
    throw error
  }
}

export const activateSubscription = async (id: number): Promise<Subscription> => {
  try {
    const response = await http.post<Subscription>(`/subscriptions/${id}/activate`)
    return response.data
  } catch (error) {
    console.error(`Error activating subscription ${id}:`, error)
    throw error
  }
}