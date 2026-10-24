import type { BranchOfficeStats } from "../types/branch-offices.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { useAuthStore } from "@/app/store/auth.store"

interface BranchOfficeStatsCardsProps {
  stats: BranchOfficeStats
}

export const BranchOfficeStatsCards = ({ stats }: BranchOfficeStatsCardsProps) => {
  const { isSuperAdmin, user } = useAuthStore()
  const showContext = !isSuperAdmin

  const cards = [
    {
      title: 'Total Sucursales',
      value: stats.total,
      icon: 'lucide:building-2',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: 'Sucursales Activas',
      value: stats.active,
      icon: 'lucide:circle-check',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Sucursales Inactivas',
      value: stats.inactive,
      icon: 'lucide:circle-x',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    }
  ]

  return (
    <div className="branch-office-stats">
      {showContext && (
        <div className="branch-office-stats__context">
          <MuiSvgIcon size={16}>lucide:building-2</MuiSvgIcon>
          <span>Estadísticas de {user?.company?.name || 'tu empresa'}</span>
        </div>
      )}
      
      <div className="branch-office-stats__grid">
        {cards.map((card, index) => (
          <div key={index} className="branch-office-stats__card">
            <div className="branch-office-stats__card-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
              <MuiSvgIcon size={24}>{card.icon}</MuiSvgIcon>
            </div>
            <div className="branch-office-stats__card-info">
              <p className="branch-office-stats__card-title">{card.title}</p>
              <p className="branch-office-stats__card-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {stats.by_company && stats.by_company.length > 0 && isSuperAdmin && (
        <div className="branch-office-stats__group">
          <h4 className="branch-office-stats__group-title">Distribución por Empresa</h4>
          <div className="branch-office-stats__group-list">
            {stats.by_company.map((item, index) => (
              <div key={index} className="branch-office-stats__group-item">
                <span className="branch-office-stats__group-label">{item.company_name}</span>
                <span className="branch-office-stats__group-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}