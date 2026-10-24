import type { StoreStats } from "../types/stores.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { useAuthStore } from "@/app/store/auth.store"

interface StoreStatsCardsProps {
  stats: StoreStats
}

export const StoreStatsCards = ({ stats }: StoreStatsCardsProps) => {
  const { isSuperAdmin, user } = useAuthStore()
  const showContext = !isSuperAdmin

  const cards = [
    {
      title: 'Total Tiendas',
      value: stats.total,
      icon: 'lucide:store',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: 'Tiendas Activas',
      value: stats.active,
      icon: 'lucide:circle-check',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Tiendas Inactivas',
      value: stats.inactive,
      icon: 'lucide:circle-x',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    }
  ]

  return (
    <div className="store-stats">
      {showContext && (
        <div className="store-stats__context">
          <MuiSvgIcon size={16}>lucide:building-2</MuiSvgIcon>
          <span>Estadísticas de {user?.company?.name || 'tu empresa'}</span>
        </div>
      )}
      
      <div className="store-stats__grid">
        {cards.map((card, index) => (
          <div key={index} className="store-stats__card">
            <div className="store-stats__card-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
              <MuiSvgIcon size={24}>{card.icon}</MuiSvgIcon>
            </div>
            <div className="store-stats__card-info">
              <p className="store-stats__card-title">{card.title}</p>
              <p className="store-stats__card-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {stats.by_branch_office && stats.by_branch_office.length > 0 && isSuperAdmin && (
        <div className="store-stats__group">
          <h4 className="store-stats__group-title">Distribución por Sucursal</h4>
          <div className="store-stats__group-list">
            {stats.by_branch_office.map((item, index) => (
              <div key={index} className="store-stats__group-item">
                <span className="store-stats__group-label">
                  {item.branch_office_name}
                  <span className="store-stats__group-sub">({item.company_name})</span>
                </span>
                <span className="store-stats__group-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.by_company && stats.by_company.length > 0 && isSuperAdmin && (
        <div className="store-stats__group">
          <h4 className="store-stats__group-title">Distribución por Empresa</h4>
          <div className="store-stats__group-list">
            {stats.by_company.map((item, index) => (
              <div key={index} className="store-stats__group-item">
                <span className="store-stats__group-label">{item.company_name}</span>
                <span className="store-stats__group-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}