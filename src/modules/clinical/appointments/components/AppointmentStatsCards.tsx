import type { AppointmentStats } from "../types/appointments.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { useAuthStore } from "@/app/store/auth.store"

interface AppointmentStatsCardsProps {
  stats: AppointmentStats
}

export const AppointmentStatsCards = ({ stats }: AppointmentStatsCardsProps) => {
  const { isSuperAdmin, user } = useAuthStore()
  const showContext = !isSuperAdmin

  const cards = [
    {
      title: 'Total Citas',
      value: stats.total,
      icon: 'lucide:calendar',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: 'Citas Confirmadas',
      value: stats.by_status[0].count,
      icon: 'lucide:circle-check',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Citas Canceladas',
      value: stats.by_status[1].count,
      icon: 'lucide:circle-x',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    },
    {
      title: 'Citas Hoy',
      value: stats.today,
      icon: 'lucide:sun',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    },
    {
      title: 'Esta Semana',
      value: stats.this_week,
      icon: 'lucide:calendar-days',
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)'
    },
    {
      title: 'Próximas Citas',
      value: stats.upcoming,
      icon: 'lucide:clock',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    }
  ]

  return (
    <div className="appointment-stats">
      {showContext && (
        <div className="appointment-stats__context">
          <MuiSvgIcon size={16}>lucide:building-2</MuiSvgIcon>
          <span>Estadísticas de {user?.company?.name || 'tu empresa'}</span>
        </div>
      )}
      
      <div className="appointment-stats__grid">
        {cards.map((card, index) => (
          <div key={index} className="appointment-stats__card">
            <div className="appointment-stats__card-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
              <MuiSvgIcon size={24}>{card.icon}</MuiSvgIcon>
            </div>
            <div className="appointment-stats__card-info">
              <p className="appointment-stats__card-title">{card.title}</p>
              <p className="appointment-stats__card-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Distribución por Optometrista */}
      {stats.by_optometrist && stats.by_optometrist.length > 0 && (
        <div className="appointment-stats__group">
          <h4 className="appointment-stats__group-title">Distribución por Optometrista</h4>
          <div className="appointment-stats__group-list">
            {stats.by_optometrist.map((item, index) => (
              <div key={index} className="appointment-stats__group-item">
                <span className="appointment-stats__group-label">{item.optometrist_name}</span>
                <span className="appointment-stats__group-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}