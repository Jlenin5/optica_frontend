import { useCashRegisterSessionSummary } from "../hooks/useCashRegisterSessionSummary"
import type { CashRegisterSession } from "../types/cash-registers.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"
import "@styles/cash-register-session.scss"

interface CashRegisterSummaryProps {
  cashRegisterSession: CashRegisterSession
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es })
}

const formatAmount = (amount: number | null) => {
  if (amount === null) return '-'
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(amount)
}

export const CashRegisterSummary = ({ cashRegisterSession }: CashRegisterSummaryProps) => {
  const { data: summary, isLoading } = useCashRegisterSessionSummary(cashRegisterSession.id)

  if (isLoading) {
    return (
      <div className="cash-register-summary__loading">
        <div className="cash-register-summary__spinner"></div>
        <p>Cargando resumen...</p>
      </div>
    )
  }

  const summaryData = summary?.summary

  return (
    <div className="cash-register-summary">
      <div className="cash-register-summary__header">
        <h3 className="cash-register-summary__title">
          <MuiSvgIcon size={20}>lucide:receipt</MuiSvgIcon>
          Resumen de la Caja
        </h3>
        <div className="cash-register-summary__info">
          <span className="cash-register-summary__info-item">
            <strong>Caja:</strong> {cashRegisterSession?.cash_register.name || `#${cashRegisterSession.id}`}
          </span>
          <span className="cash-register-summary__info-item">
            <strong>Tienda:</strong> {cashRegisterSession.cash_register?.store?.name || '-'}
          </span>
          <span className="cash-register-summary__info-item">
            <strong>Usuario:</strong> {cashRegisterSession.user?.username || '-'}
          </span>
          <span className="cash-register-summary__info-item">
            <strong>Apertura:</strong> {formatDate(cashRegisterSession.opened_at)}
          </span>
          {cashRegisterSession.closed_at && (
            <span className="cash-register-summary__info-item">
              <strong>Cierre:</strong> {formatDate(cashRegisterSession.closed_at)}
            </span>
          )}
        </div>
      </div>

      <div className="cash-register-summary__grid">
        <div className="cash-register-summary__card cash-register-summary__card--opening">
          <div className="cash-register-summary__card-icon">
            <MuiSvgIcon size={24}>lucide:arrow-right-left</MuiSvgIcon>
          </div>
          <div className="cash-register-summary__card-info">
            <p className="cash-register-summary__card-title">Monto de Apertura</p>
            <p className="cash-register-summary__card-value">{formatAmount(summaryData?.opening_amount)}</p>
          </div>
        </div>

        <div className="cash-register-summary__card cash-register-summary__card--income">
          <div className="cash-register-summary__card-icon">
            <MuiSvgIcon size={24}>lucide:trending-up</MuiSvgIcon>
          </div>
          <div className="cash-register-summary__card-info">
            <p className="cash-register-summary__card-title">Total Ingresos</p>
            <p className="cash-register-summary__card-value cash-register-summary__card-value--income">
              {formatAmount(summaryData?.total_income)}
            </p>
          </div>
        </div>

        <div className="cash-register-summary__card cash-register-summary__card--expense">
          <div className="cash-register-summary__card-icon">
            <MuiSvgIcon size={24}>lucide:trending-down</MuiSvgIcon>
          </div>
          <div className="cash-register-summary__card-info">
            <p className="cash-register-summary__card-title">Total Egresos</p>
            <p className="cash-register-summary__card-value cash-register-summary__card-value--expense">
              {formatAmount(summaryData?.total_expense)}
            </p>
          </div>
        </div>

        <div className="cash-register-summary__card cash-register-summary__card--expected">
          <div className="cash-register-summary__card-icon">
            <MuiSvgIcon size={24}>lucide:calculator</MuiSvgIcon>
          </div>
          <div className="cash-register-summary__card-info">
            <p className="cash-register-summary__card-title">Monto Esperado</p>
            <p className="cash-register-summary__card-value cash-register-summary__card-value--expected">
              {formatAmount(summaryData?.expected_amount)}
            </p>
          </div>
        </div>

        <div className="cash-register-summary__card cash-register-summary__card--closing">
          <div className="cash-register-summary__card-icon">
            <MuiSvgIcon size={24}>lucide:lock</MuiSvgIcon>
          </div>
          <div className="cash-register-summary__card-info">
            <p className="cash-register-summary__card-title">Monto de Cierre</p>
            <p className="cash-register-summary__card-value">{formatAmount(summaryData?.closing_amount)}</p>
          </div>
        </div>

        <div className="cash-register-summary__card cash-register-summary__card--difference">
          <div className="cash-register-summary__card-icon">
            <MuiSvgIcon size={24}>lucide:scale</MuiSvgIcon>
          </div>
          <div className="cash-register-summary__card-info">
            <p className="cash-register-summary__card-title">Diferencia</p>
            <p className={`cash-register-summary__card-value ${summaryData?.difference_amount !== 0 ? 'cash-register-summary__card-value--warning' : ''}`}>
              {formatAmount(summaryData?.difference_amount)}
            </p>
          </div>
        </div>
      </div>

      {cashRegisterSession.notes && (
        <div className="cash-register-summary__notes">
          <h4 className="cash-register-summary__notes-title">Notas</h4>
          <p className="cash-register-summary__notes-text">{cashRegisterSession.notes}</p>
        </div>
      )}
    </div>
  )
}