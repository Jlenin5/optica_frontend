import type { CashRegisterStats } from "../types/cash-registers.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { useAuthStore } from "@/app/store/auth.store"

interface CashRegisterStatsCardsProps {
  stats: CashRegisterStats
}

export const CashRegisterStatsCards = ({ stats }: CashRegisterStatsCardsProps) => {
  const { isSuperAdmin, user } = useAuthStore()
  const showContext = !isSuperAdmin

  const cards = [
    {
      title: 'Total Cajas',
      value: stats.total_registers,
      icon: 'lucide:credit-card',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: 'Cajas Activas',
      value: stats.active_registers,
      icon: 'lucide:circle-check',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Cajas Inactivas',
      value: stats.inactive_registers,
      icon: 'lucide:circle-x',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    },
    {
      title: 'Sesiones Abiertas',
      value: stats.open_sessions,
      icon: 'lucide:lock-open',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    },
    {
      title: 'Sesiones Cerradas',
      value: stats.closed_sessions,
      icon: 'lucide:lock',
      color: '#6b7280',
      bgColor: 'rgba(107, 114, 128, 0.1)'
    }
  ]

  return (
    <div className="cash-register-stats">
      {showContext && (
        <div className="cash-register-stats__context">
          <MuiSvgIcon size={16}>lucide:building-2</MuiSvgIcon>
          <span>Estadísticas de {user?.company?.name || 'tu empresa'}</span>
        </div>
      )}
      
      <div className="cash-register-stats__grid">
        {cards.map((card, index) => (
          <div key={index} className="cash-register-stats__card">
            <div className="cash-register-stats__card-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
              <MuiSvgIcon size={24}>{card.icon}</MuiSvgIcon>
            </div>
            <div className="cash-register-stats__card-info">
              <p className="cash-register-stats__card-title">{card.title}</p>
              <p className="cash-register-stats__card-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {stats.by_store && stats.by_store.length > 0 && (
        <div className="cash-register-stats__group">
          <h4 className="cash-register-stats__group-title">Distribución por Tienda</h4>
          <div className="cash-register-stats__group-list">
            {stats.by_store.map((item, index) => (
              <div key={index} className="cash-register-stats__group-item">
                <span className="cash-register-stats__group-label">{item.store_name}</span>
                <span className="cash-register-stats__group-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}