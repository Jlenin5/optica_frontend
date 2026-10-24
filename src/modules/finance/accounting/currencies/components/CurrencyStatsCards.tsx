import type { CurrencyStats } from "../types/currencies.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface CurrencyStatsCardsProps {
  stats: CurrencyStats
}

export const CurrencyStatsCards = ({ stats }: CurrencyStatsCardsProps) => {
  const cards = [
    {
      title: 'Total Monedas',
      value: stats.total,
      icon: 'lucide:circle-dollar-sign',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    }
  ]

  return (
    <div className="currency-stats">
      <div className="currency-stats__grid">
        {cards.map((card, index) => (
          <div key={index} className="currency-stats__card">
            <div className="currency-stats__card-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
              <MuiSvgIcon size={24}>{card.icon}</MuiSvgIcon>
            </div>
            <div className="currency-stats__card-info">
              <p className="currency-stats__card-title">{card.title}</p>
              <p className="currency-stats__card-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}