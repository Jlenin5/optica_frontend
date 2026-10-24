import http from "@/services/http"
import type { 
  DashboardStats, 
  RecentActivity, 
  ChartData, 
  TopProduct 
} from "../types/dashboard.types"

export const getDashboardStats = async (companyId?: number): Promise<DashboardStats> => {
  try {
    const params = companyId ? { company_id: companyId } : {}
    const response = await http.get<DashboardStats>('/dashboard/stats', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    throw error
  }
}

export const getRecentActivities = async (companyId?: number): Promise<RecentActivity[]> => {
  try {
    const params = companyId ? { company_id: companyId } : {}
    const response = await http.get<RecentActivity[]>('/dashboard/activities', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching recent activities:', error)
    throw error
  }
}

export const getAppointmentsChart = async (companyId?: number): Promise<ChartData> => {
  try {
    const params = companyId ? { company_id: companyId } : {}
    const response = await http.get<ChartData>('/dashboard/charts/appointments', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching appointments chart:', error)
    throw error
  }
}

export const getSalesChart = async (companyId?: number): Promise<ChartData> => {
  try {
    const params = companyId ? { company_id: companyId } : {}
    const response = await http.get<ChartData>('/dashboard/charts/sales', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching sales chart:', error)
    throw error
  }
}

export const getTopProducts = async (companyId?: number): Promise<TopProduct[]> => {
  try {
    const params = companyId ? { company_id: companyId } : {}
    const response = await http.get<TopProduct[]>('/dashboard/top-products', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching top products:', error)
    throw error
  }
}