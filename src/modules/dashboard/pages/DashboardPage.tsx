import { useEffect, useState } from "react"
import { useDashboardData } from "../hooks/useDashboardData"
import { StatsCard } from "../components/StatsCard"
import { QuickActions } from "../components/QuickActions"
import { RecentActivities } from "../components/RecentActivities"
import { AppointmentsChart } from "../components/AppointmentsChart"
import { SalesChart } from "../components/SalesChart"
import { TopProducts } from "../components/TopProducts"
import { WelcomeBanner } from "../components/WelcomeBanner"
import { BusinessSummary } from "../components/BusinessSummary"
import { OperationalStatus } from "../components/OperationalStatus"
import { InventoryStatus } from "../components/InventoryStatus"
import { DashboardSkeleton } from "../components/DashboardSkeleton"
import { useAuthStore } from "@/app/store/auth.store"
import "@/styles/dashboard.scss"

export const DashboardPage = () => {
  const { user } = useAuthStore()
  const { stats, recentActivities, appointmentsChart, salesChart, topProducts, isLoading, isError, refetch } = useDashboardData()
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()
    setGreeting(hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches")
  }, [])

  if (isLoading) return <DashboardSkeleton />

  const money = (value = 0) =>
    new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", maximumFractionDigits: 2 }).format(value)

  return (
    <div className="dashboard">
      <WelcomeBanner
        greeting={greeting}
        username={user?.username}
        companyName={user?.company?.name}
        branchName={user?.branch_office?.name}
      />

      {isError && (
        <div className="dashboard__error" role="alert">
          <div>
            <strong>No pudimos cargar todo el resumen.</strong>
            <span>Verifica la conexión con el backend e inténtalo nuevamente.</span>
          </div>
          <button type="button" onClick={refetch}>Reintentar</button>
        </div>
      )}

      <div className="dashboard__actions"><QuickActions /></div>

      <section className="dashboard__stats" aria-label="Indicadores del negocio">
        <StatsCard title="Pacientes" value={stats?.totalPatients ?? 0} icon="lucide:users" color="blue" />
        <StatsCard title="Citas hoy" value={stats?.todayAppointments ?? 0} icon="lucide:calendar-check" color="green" />
        <StatsCard title="Ventas del mes" value={money(stats?.monthlySales)} icon="lucide:shopping-cart" color="purple" />
        <StatsCard title="Ventas pendientes" value={stats?.pendingOrders ?? 0} icon="lucide:clock-3" color="orange" />
        <StatsCard title="Facturas pendientes" value={stats?.pendingInvoices ?? 0} icon="lucide:file-warning" color="red" />
        <StatsCard title="Suscripciones activas" value={stats?.activeSubscriptions ?? 0} icon="lucide:badge-check" color="blue" />
      </section>

      <section className="dashboard__secondary-stats" aria-label="Indicadores complementarios">
        <div><span>Pacientes este mes</span><strong>{stats?.monthlyPatients ?? 0}</strong></div>
        <div><span>Citas esta semana</span><strong>{stats?.weeklyAppointments ?? 0}</strong></div>
        <div><span>Ingresos acumulados</span><strong>{money(stats?.totalRevenue)}</strong></div>
      </section>

      <div className="dashboard__charts">
        <AppointmentsChart data={appointmentsChart} />
        <SalesChart data={salesChart} />
      </div>

      <section className="dashboard__insights" aria-label="Resumen operativo y de inventario">
        <BusinessSummary
          monthlyPatients={stats?.monthlyPatients ?? 0}
          weeklyAppointments={stats?.weeklyAppointments ?? 0}
          totalRevenue={stats?.totalRevenue ?? 0}
        />
        <OperationalStatus
          pendingOrders={stats?.pendingOrders ?? 0}
          pendingInvoices={stats?.pendingInvoices ?? 0}
          todayAppointments={stats?.todayAppointments ?? 0}
          activeSubscriptions={stats?.activeSubscriptions ?? 0}
        />
        <InventoryStatus
          lowStockProducts={stats?.lowStockProducts ?? 0}
          totalPatients={stats?.totalPatients ?? 0}
          monthlySales={stats?.monthlySales ?? 0}
        />
      </section>

      <div className="dashboard__bottom">
        <div className="dashboard__recent"><RecentActivities activities={recentActivities || []} /></div>
        <div className="dashboard__top-products"><TopProducts products={topProducts || []} /></div>
      </div>
    </div>
  )
}
