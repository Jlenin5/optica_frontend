import type { TypeOfReceiptStats } from "../types/type-of-receipts.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface TypeOfReceiptStatsCardsProps {
  stats: TypeOfReceiptStats
}

export const TypeOfReceiptStatsCards = ({ stats }: TypeOfReceiptStatsCardsProps) => {
  const cards = [
    {
      title: 'Total Tipos de Recibo',
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
    }
  ]

  return (
    <div className="type-of-receipt-stats">
      {cards.map((card, index) => (
        <div key={index} className="type-of-receipt-stats__card">
          <div className="type-of-receipt-stats__card-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
            <MuiSvgIcon size={24}>{card.icon}</MuiSvgIcon>
          </div>
          <div className="type-of-receipt-stats__card-info">
            <p className="type-of-receipt-stats__card-title">{card.title}</p>
            <p className="type-of-receipt-stats__card-value">{card.value}</p>
          </div>
        </div>
      ))}

      {/* Distribución por empresa */}
      {stats.by_company && stats.by_company.length > 0 && (
        <div className="type-of-receipt-stats__group">
          <h4 className="type-of-receipt-stats__group-title">Por Empresa</h4>
          <div className="type-of-receipt-stats__group-list">
            {stats.by_company.map((item, index) => (
              <div key={index} className="type-of-receipt-stats__group-item">
                <span className="type-of-receipt-stats__group-label">{item.company_name}</span>
                <span className="type-of-receipt-stats__group-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Distribución por recibo */}
      {stats.by_receipt && stats.by_receipt.length > 0 && (
        <div className="type-of-receipt-stats__group">
          <h4 className="type-of-receipt-stats__group-title">Por Recibo</h4>
          <div className="type-of-receipt-stats__group-list">
            {stats.by_receipt.map((item, index) => (
              <div key={index} className="type-of-receipt-stats__group-item">
                <span className="type-of-receipt-stats__group-label">{item.receipt_description}</span>
                <span className="type-of-receipt-stats__group-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}