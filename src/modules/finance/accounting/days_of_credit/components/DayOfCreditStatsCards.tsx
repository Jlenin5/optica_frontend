import type { DayOfCreditStats } from "../types/days-of-credit.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface DayOfCreditStatsCardsProps {
  stats: DayOfCreditStats
}

export const DayOfCreditStatsCards = ({ stats }: DayOfCreditStatsCardsProps) => {
  const cards = [
    {
      title: 'Total Días de Crédito',
      value: stats.total,
      icon: 'lucide:calendar',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    }
  ]

  return (
    <div className="day-of-credit-stats">
      <div className="day-of-credit-stats__grid">
        {cards.map((card, index) => (
          <div key={index} className="day-of-credit-stats__card">
            <div className="day-of-credit-stats__card-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
              <MuiSvgIcon size={24}>{card.icon}</MuiSvgIcon>
            </div>
            <div className="day-of-credit-stats__card-info">
              <p className="day-of-credit-stats__card-title">{card.title}</p>
              <p className="day-of-credit-stats__card-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {stats.by_days && stats.by_days.length > 0 && (
        <div className="day-of-credit-stats__group">
          <h4 className="day-of-credit-stats__group-title">Distribución por Días</h4>
          <div className="day-of-credit-stats__group-list">
            {stats.by_days.map((item, index) => (
              <div key={index} className="day-of-credit-stats__group-item">
                <span className="day-of-credit-stats__group-label">
                  {item.days === 'null' ? 'Sin especificar' : `${item.days} días`}
                </span>
                <span className="day-of-credit-stats__group-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}