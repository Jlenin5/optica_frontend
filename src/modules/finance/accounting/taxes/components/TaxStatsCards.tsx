import type { TaxStats } from "../types/taxes.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface TaxStatsCardsProps {
  stats: TaxStats
}

export const TaxStatsCards = ({ stats }: TaxStatsCardsProps) => {
  const cards = [
    {
      title: 'Total Impuestos',
      value: stats.total,
      icon: 'lucide:receipt',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: 'Porcentaje Promedio',
      value: `${stats.active_percentage}%`,
      icon: 'lucide:percent',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    }
  ]

  return (
    <div className="tax-stats">
      <div className="tax-stats__grid">
        {cards.map((card, index) => (
          <div key={index} className="tax-stats__card">
            <div className="tax-stats__card-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
              <MuiSvgIcon size={24}>{card.icon}</MuiSvgIcon>
            </div>
            <div className="tax-stats__card-info">
              <p className="tax-stats__card-title">{card.title}</p>
              <p className="tax-stats__card-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {stats.by_code && stats.by_code.length > 0 && (
        <div className="tax-stats__group">
          <h4 className="tax-stats__group-title">Distribución por Código</h4>
          <div className="tax-stats__group-list">
            {stats.by_code.map((item, index) => (
              <div key={index} className="tax-stats__group-item">
                <span className="tax-stats__group-label">{item.code}</span>
                <span className="tax-stats__group-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}