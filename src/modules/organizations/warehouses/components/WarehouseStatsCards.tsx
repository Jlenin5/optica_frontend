import type { WarehouseStats } from "../types/warehouses.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { useAuthStore } from "@/app/store/auth.store"

interface WarehouseStatsCardsProps {
  stats: WarehouseStats
}

export const WarehouseStatsCards = ({ stats }: WarehouseStatsCardsProps) => {
  const { isSuperAdmin, user } = useAuthStore()
  const showContext = !isSuperAdmin

  const cards = [
    {
      title: 'Total Almacenes',
      value: stats.total,
      icon: 'lucide:warehouse',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: 'Almacenes Activos',
      value: stats.active,
      icon: 'lucide:circle-check',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Almacenes Inactivos',
      value: stats.inactive,
      icon: 'lucide:circle-x',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    }
  ]

  return (
    <div className="warehouse-stats">
      {showContext && (
        <div className="warehouse-stats__context">
          <MuiSvgIcon size={16}>lucide:building-2</MuiSvgIcon>
          <span>Estadísticas de {user?.company?.name || 'tu empresa'}</span>
        </div>
      )}
      
      <div className="warehouse-stats__grid">
        {cards.map((card, index) => (
          <div key={index} className="warehouse-stats__card">
            <div className="warehouse-stats__card-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
              <MuiSvgIcon size={24}>{card.icon}</MuiSvgIcon>
            </div>
            <div className="warehouse-stats__card-info">
              <p className="warehouse-stats__card-title">{card.title}</p>
              <p className="warehouse-stats__card-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {stats.by_company && stats.by_company.length > 0 && isSuperAdmin && (
        <div className="warehouse-stats__group">
          <h4 className="warehouse-stats__group-title">Distribución por Empresa</h4>
          <div className="warehouse-stats__group-list">
            {stats.by_company.map((item, index) => (
              <div key={index} className="warehouse-stats__group-item">
                <span className="warehouse-stats__group-label">{item.company_name}</span>
                <span className="warehouse-stats__group-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.by_branch_office && stats.by_branch_office.length > 0 && isSuperAdmin && (
        <div className="warehouse-stats__group">
          <h4 className="warehouse-stats__group-title">Distribución por Sucursal</h4>
          <div className="warehouse-stats__group-list">
            {stats.by_branch_office.map((item, index) => (
              <div key={index} className="warehouse-stats__group-item">
                <span className="warehouse-stats__group-label">{item.branch_office_name}</span>
                <span className="warehouse-stats__group-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}