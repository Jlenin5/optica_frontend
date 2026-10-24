import type { BankStats } from "../types/banks.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface BankStatsCardsProps {
  stats: BankStats
}

export const BankStatsCards = ({ stats }: BankStatsCardsProps) => {
  const cards = [
    {
      title: 'Total Bancos',
      value: stats.total,
      icon: 'lucide:building',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: 'Con RUC',
      value: stats.with_ruc,
      icon: 'lucide:file-text',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Sin RUC',
      value: stats.without_ruc,
      icon: 'lucide:file-question',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    }
  ]

  return (
    <div className="bank-stats">
      <div className="bank-stats__grid">
        {cards.map((card, index) => (
          <div key={index} className="bank-stats__card">
            <div className="bank-stats__card-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
              <MuiSvgIcon size={24}>{card.icon}</MuiSvgIcon>
            </div>
            <div className="bank-stats__card-info">
              <p className="bank-stats__card-title">{card.title}</p>
              <p className="bank-stats__card-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}