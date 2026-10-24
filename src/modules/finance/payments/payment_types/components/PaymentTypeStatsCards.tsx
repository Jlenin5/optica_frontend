import type { PaymentTypeStats } from "../types/payment-types.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface PaymentTypeStatsCardsProps {
  stats: PaymentTypeStats
}

export const PaymentTypeStatsCards = ({ stats }: PaymentTypeStatsCardsProps) => {
  const cards = [
    {
      title: 'Total Tipos de Pago',
      value: stats.total,
      icon: 'lucide:credit-card',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: 'Con Financiamiento',
      value: stats.with_financing,
      icon: 'lucide:trending-up',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Sin Financiamiento',
      value: stats.without_financing,
      icon: 'lucide:trending-down',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    }
  ]

  return (
    <div className="payment-type-stats">
      <div className="payment-type-stats__grid">
        {cards.map((card, index) => (
          <div key={index} className="payment-type-stats__card">
            <div className="payment-type-stats__card-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
              <MuiSvgIcon size={24}>{card.icon}</MuiSvgIcon>
            </div>
            <div className="payment-type-stats__card-info">
              <p className="payment-type-stats__card-title">{card.title}</p>
              <p className="payment-type-stats__card-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}