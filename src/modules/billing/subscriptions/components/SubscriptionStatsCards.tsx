import type { SubscriptionStats } from "../types/subscriptions.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface SubscriptionStatsCardsProps {
  stats: SubscriptionStats
}

export const SubscriptionStatsCards = ({ stats }: SubscriptionStatsCardsProps) => {
  const cards = [
    {
      title: 'Total Suscripciones',
      value: stats.total,
      icon: 'lucide:package',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: 'Activas',
      value: stats.active,
      icon: 'lucide:check-circle',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'En Trial',
      value: stats.trial,
      icon: 'lucide:clock',
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)'
    },
    {
      title: 'Pendientes',
      value: stats.past_due,
      icon: 'lucide:alert-circle',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    },
    {
      title: 'Canceladas',
      value: stats.canceled,
      icon: 'lucide:x-circle',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    },
    {
      title: 'Por Vencer',
      value: stats.expiring_soon,
      icon: 'lucide:hourglass',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    }
  ]

  return (
    <div className="subscription-stats">
      {cards.map((card, index) => (
        <div key={index} className="subscription-stats__card">
          <div className="subscription-stats__card-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
            <MuiSvgIcon size={24}>{card.icon}</MuiSvgIcon>
          </div>
          <div className="subscription-stats__card-info">
            <p className="subscription-stats__card-title">{card.title}</p>
            <p className="subscription-stats__card-value">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}