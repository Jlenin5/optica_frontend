import type { BankAccountStats } from "../types/bank-accounts.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { useAuthStore } from "@/app/store/auth.store"

interface BankAccountStatsCardsProps {
  stats: BankAccountStats
}

export const BankAccountStatsCards = ({ stats }: BankAccountStatsCardsProps) => {
  const { isSuperAdmin, user } = useAuthStore()
  const showContext = !isSuperAdmin

  const cards = [
    {
      title: 'Total Cuentas',
      value: stats.total,
      icon: 'lucide:credit-card',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    }
  ]

  return (
    <div className="bank-account-stats">
      {showContext && (
        <div className="bank-account-stats__context">
          <MuiSvgIcon size={16}>lucide:building-2</MuiSvgIcon>
          <span>Estadísticas de {user?.company?.name || 'tu empresa'}</span>
        </div>
      )}
      
      <div className="bank-account-stats__grid">
        {cards.map((card, index) => (
          <div key={index} className="bank-account-stats__card">
            <div className="bank-account-stats__card-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
              <MuiSvgIcon size={24}>{card.icon}</MuiSvgIcon>
            </div>
            <div className="bank-account-stats__card-info">
              <p className="bank-account-stats__card-title">{card.title}</p>
              <p className="bank-account-stats__card-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {stats.by_bank && stats.by_bank.length > 0 && (
        <div className="bank-account-stats__group">
          <h4 className="bank-account-stats__group-title">Distribución por Banco</h4>
          <div className="bank-account-stats__group-list">
            {stats.by_bank.map((item, index) => (
              <div key={index} className="bank-account-stats__group-item">
                <span className="bank-account-stats__group-label">{item.bank_name}</span>
                <span className="bank-account-stats__group-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.by_currency && stats.by_currency.length > 0 && (
        <div className="bank-account-stats__group">
          <h4 className="bank-account-stats__group-title">Distribución por Moneda</h4>
          <div className="bank-account-stats__group-list">
            {stats.by_currency.map((item, index) => (
              <div key={index} className="bank-account-stats__group-item">
                <span className="bank-account-stats__group-label">{item.currency_code}</span>
                <span className="bank-account-stats__group-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}