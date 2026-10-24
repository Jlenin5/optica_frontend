import type { ReceiptStats } from "../types/receipts.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface ReceiptStatsCardsProps {
  stats: ReceiptStats
}

export const ReceiptStatsCards = ({ stats }: ReceiptStatsCardsProps) => {
  const cards = [
    {
      title: 'Total Recibos',
      value: stats.total,
      icon: 'lucide:file-text',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: 'Activos',
      value: stats.active,
      icon: 'lucide:circle-check',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Inactivos',
      value: stats.inactive,
      icon: 'lucide:circle-x',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    },
    {
      title: 'Últimos 30 días',
      value: stats.last_30_days,
      icon: 'lucide:calendar',
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)'
    }
  ]

  return (
    <div className="receipt-stats">
      {cards.map((card, index) => (
        <div key={index} className="receipt-stats__card">
          <div className="receipt-stats__card-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
            <MuiSvgIcon size={24}>{card.icon}</MuiSvgIcon>
          </div>
          <div className="receipt-stats__card-info">
            <p className="receipt-stats__card-title">{card.title}</p>
            <p className="receipt-stats__card-value">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}