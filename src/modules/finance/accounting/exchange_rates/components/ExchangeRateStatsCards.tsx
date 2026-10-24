import type { ExchangeRateStats } from "../types/exchange-rates.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface ExchangeRateStatsCardsProps {
  stats: ExchangeRateStats
}

const formatAmount = (amount: number | null) => {
  if (amount === null) return '-'
  return new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4
  }).format(amount)
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es })
}

export const ExchangeRateStatsCards = ({ stats }: ExchangeRateStatsCardsProps) => {
  const cards = [
    {
      title: 'Total Registros',
      value: stats.total,
      icon: 'lucide:database',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: 'Promedio Comercial',
      value: formatAmount(stats.amount_commercial),
      icon: 'lucide:trending-up',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Promedio SUNAT',
      value: formatAmount(stats.amount_sunat),
      icon: 'lucide:building',
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)'
    },
    {
      title: 'Promedio SBS',
      value: formatAmount(stats.amount_sbs),
      icon: 'lucide:banknote',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    }
  ]

  return (
    <div className="exchange-rate-stats">
      <div className="exchange-rate-stats__grid">
        {cards.map((card, index) => (
          <div key={index} className="exchange-rate-stats__card">
            <div className="exchange-rate-stats__card-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
              <MuiSvgIcon size={24}>{card.icon}</MuiSvgIcon>
            </div>
            <div className="exchange-rate-stats__card-info">
              <p className="exchange-rate-stats__card-title">{card.title}</p>
              <p className="exchange-rate-stats__card-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {stats.latest && (
        <div className="exchange-rate-stats__latest">
          <h4 className="exchange-rate-stats__latest-title">
            <MuiSvgIcon size={18}>lucide:clock</MuiSvgIcon>
            Última Actualización
          </h4>
          <div className="exchange-rate-stats__latest-grid">
            <div className="exchange-rate-stats__latest-item">
              <span className="exchange-rate-stats__latest-label">Comercial</span>
              <span className="exchange-rate-stats__latest-value">
                {formatAmount(stats.latest.amount_commercial)}
              </span>
            </div>
            <div className="exchange-rate-stats__latest-item">
              <span className="exchange-rate-stats__latest-label">SUNAT</span>
              <span className="exchange-rate-stats__latest-value">
                {formatAmount(stats.latest.amount_sunat)}
              </span>
            </div>
            <div className="exchange-rate-stats__latest-item">
              <span className="exchange-rate-stats__latest-label">SBS</span>
              <span className="exchange-rate-stats__latest-value">
                {formatAmount(stats.latest.amount_sbs)}
              </span>
            </div>
            <div className="exchange-rate-stats__latest-item exchange-rate-stats__latest-item--full">
              <span className="exchange-rate-stats__latest-label">Fecha</span>
              <span className="exchange-rate-stats__latest-value">
                {formatDate(stats.latest.created_at)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}