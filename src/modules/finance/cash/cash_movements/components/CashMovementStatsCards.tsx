import type { CashMovementStats } from "../types/cash-movements.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface CashMovementStatsCardsProps {
  stats: CashMovementStats
}

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(amount)
}

export const CashMovementStatsCards = ({ stats }: CashMovementStatsCardsProps) => {
  const cards = [
    {
      title: 'Total Ingresos',
      value: formatAmount(stats.total_income),
      icon: 'lucide:trending-up',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Total Egresos',
      value: formatAmount(stats.total_expense),
      icon: 'lucide:trending-down',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    },
    {
      title: 'Saldo',
      value: formatAmount(stats.balance),
      icon: 'lucide:scale',
      color: stats.balance >= 0 ? '#10b981' : '#ef4444',
      bgColor: stats.balance >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
    },
    {
      title: 'Ingresos Hoy',
      value: formatAmount(stats.today_income),
      icon: 'lucide:sun',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: 'Egresos Hoy',
      value: formatAmount(stats.today_expense),
      icon: 'lucide:moon',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    },
    {
      title: 'Ingresos Semana',
      value: formatAmount(stats.this_week_income),
      icon: 'lucide:calendar',
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)'
    },
    {
      title: 'Egresos Semana',
      value: formatAmount(stats.this_week_expense),
      icon: 'lucide:calendar',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    }
  ]

  return (
    <div className="cash-movement-stats">
      <div className="cash-movement-stats__grid">
        {cards.map((card, index) => (
          <div key={index} className="cash-movement-stats__card">
            <div className="cash-movement-stats__card-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
              <MuiSvgIcon size={24}>{card.icon}</MuiSvgIcon>
            </div>
            <div className="cash-movement-stats__card-info">
              <p className="cash-movement-stats__card-title">{card.title}</p>
              <p className="cash-movement-stats__card-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {stats.by_source && stats.by_source.length > 0 && (
        <div className="cash-movement-stats__group">
          <h4 className="cash-movement-stats__group-title">Por Fuente</h4>
          <div className="cash-movement-stats__group-list">
            {stats.by_source.map((item, index) => (
              <div key={index} className="cash-movement-stats__group-item">
                <span className="cash-movement-stats__group-label">{item.source_display}</span>
                <div className="cash-movement-stats__group-values">
                  <span className="cash-movement-stats__group-amount">{formatAmount(item.total)}</span>
                  <span className="cash-movement-stats__group-count">({item.count})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.by_payment_method && stats.by_payment_method.length > 0 && (
        <div className="cash-movement-stats__group">
          <h4 className="cash-movement-stats__group-title">Por Método de Pago</h4>
          <div className="cash-movement-stats__group-list">
            {stats.by_payment_method.map((item, index) => (
              <div key={index} className="cash-movement-stats__group-item">
                <span className="cash-movement-stats__group-label">{item.payment_method_name}</span>
                <div className="cash-movement-stats__group-values">
                  <span className="cash-movement-stats__group-amount">{formatAmount(item.total)}</span>
                  <span className="cash-movement-stats__group-count">({item.count})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}