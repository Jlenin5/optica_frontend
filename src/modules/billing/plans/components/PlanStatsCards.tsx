import type { PlanStats } from "../types/plans.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface PlanStatsCardsProps {
  stats: PlanStats
}

export const PlanStatsCards = ({ stats }: PlanStatsCardsProps) => {
  const cards = [
    {
      title: 'Total Planes',
      value: stats.total_plans,
      icon: 'lucide:package',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: 'Planes Activos',
      value: stats.active_plans,
      icon: 'lucide:check-circle',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Planes Inactivos',
      value: stats.inactive_plans,
      icon: 'lucide:circle',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    },
    {
      title: 'Planes Públicos',
      value: stats.public_plans,
      icon: 'lucide:globe',
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)'
    },
    {
      title: 'Planes Privados',
      value: stats.private_plans,
      icon: 'lucide:lock',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    }
  ]

  return (
    <div className="plan-stats">
      {cards.map((card, index) => (
        <div key={index} className="plan-stats__card">
          <div className="plan-stats__card-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
            <MuiSvgIcon size={24}>{card.icon}</MuiSvgIcon>
          </div>
          <div className="plan-stats__card-info">
            <p className="plan-stats__card-title">{card.title}</p>
            <p className="plan-stats__card-value">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}