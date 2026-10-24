import type { PaymentMethodStats } from "../types/payment-methods.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface PaymentMethodStatsCardsProps {
  stats: PaymentMethodStats
}

export const PaymentMethodStatsCards = ({ stats }: PaymentMethodStatsCardsProps) => {
  const cards = [
    {
      title: 'Total Métodos de Pago',
      value: stats.total,
      icon: 'lucide:wallet',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: 'Con Código',
      value: stats.with_code,
      icon: 'lucide:tag',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Sin Código',
      value: stats.without_code,
      icon: 'lucide:tag-off',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    }
  ]

  return (
    <div className="payment-method-stats">
      <div className="payment-method-stats__grid">
        {cards.map((card, index) => (
          <div key={index} className="payment-method-stats__card">
            <div className="payment-method-stats__card-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
              <MuiSvgIcon size={24}>{card.icon}</MuiSvgIcon>
            </div>
            <div className="payment-method-stats__card-info">
              <p className="payment-method-stats__card-title">{card.title}</p>
              <p className="payment-method-stats__card-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}