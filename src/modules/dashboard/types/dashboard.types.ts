export interface DashboardStats {
  totalPatients: number
  todayAppointments: number
  monthlySales: number
  pendingOrders: number
  weeklyAppointments: number
  monthlyPatients: number
  totalRevenue: number
  activeSubscriptions: number
  lowStockProducts: number
  pendingInvoices: number
}

export interface RecentActivity {
  id: string
  type: 'appointment' | 'patient' | 'customer' | 'sale' | 'order'
  title: string
  description: string
  time: string
  status?: string
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
  }[]
}

export interface TopProduct {
  id: number
  name: string
  sales: number
  revenue: number
  image?: string
}
