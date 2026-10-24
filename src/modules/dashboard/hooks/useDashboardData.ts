import { useQuery } from "@tanstack/react-query"
import { 
  getDashboardStats, 
  getRecentActivities, 
  getAppointmentsChart,
  getSalesChart,
  getTopProducts 
} from "../api/dashboard.api"
import { useAuthStore } from "@/app/store/auth.store"

export const useDashboardData = () => {
  const { currentCompanyId } = useAuthStore()
  
  const stats = useQuery({
    queryKey: ["dashboard", "stats", currentCompanyId],
    queryFn: () => getDashboardStats(currentCompanyId || undefined),
    staleTime: 5 * 60 * 1000,
  })

  const recentActivities = useQuery({
    queryKey: ["dashboard", "activities", currentCompanyId],
    queryFn: () => getRecentActivities(currentCompanyId || undefined),
    staleTime: 5 * 60 * 1000,
  })

  const appointmentsChart = useQuery({
    queryKey: ["dashboard", "appointments-chart", currentCompanyId],
    queryFn: () => getAppointmentsChart(currentCompanyId || undefined),
    staleTime: 5 * 60 * 1000,
  })

  const salesChart = useQuery({
    queryKey: ["dashboard", "sales-chart", currentCompanyId],
    queryFn: () => getSalesChart(currentCompanyId || undefined),
    staleTime: 5 * 60 * 1000,
  })

  const topProducts = useQuery({
    queryKey: ["dashboard", "top-products", currentCompanyId],
    queryFn: () => getTopProducts(currentCompanyId || undefined),
    staleTime: 5 * 60 * 1000,
  })

  return {
    stats: stats.data,
    recentActivities: recentActivities.data,
    appointmentsChart: appointmentsChart.data,
    salesChart: salesChart.data,
    topProducts: topProducts.data,
    isLoading: stats.isLoading || recentActivities.isLoading,
    isError: stats.isError || recentActivities.isError,
    refetch: () => {
      stats.refetch()
      recentActivities.refetch()
      appointmentsChart.refetch()
      salesChart.refetch()
      topProducts.refetch()
    }
  }
}