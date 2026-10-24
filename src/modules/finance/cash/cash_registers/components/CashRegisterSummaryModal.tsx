import { AppModal } from '@/components/ui/modal'
import { useCashRegisterSummary } from "../hooks/useCashRegisterSummary"
import type { CashRegisterSession } from "../types/cash-registers.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface CashRegisterSummaryModalProps {
  cashRegisterSession: CashRegisterSession
  onClose: () => void
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

export const CashRegisterSummaryModal = ({ cashRegisterSession, onClose }: CashRegisterSummaryModalProps) => {
  const { data: summary, isLoading } = useCashRegisterSummary(cashRegisterSession.id)

  return (
    <AppModal title="Resumen de Caja" onClose={onClose} size="lg">
        <div className="cash-register-summary-modal__content">
          <div className="cash-register-summary-modal__info">
            <div className="cash-register-summary-modal__info-item">
              <span className="cash-register-summary-modal__info-label">Caja:</span>
              <span className="cash-register-summary-modal__info-value">
                {cashRegisterSession.cash_register?.name || `#${cashRegisterSession.id}`}
              </span>
            </div>
            <div className="cash-register-summary-modal__info-item">
              <span className="cash-register-summary-modal__info-label">Tienda:</span>
              <span className="cash-register-summary-modal__info-value">
                {cashRegisterSession.cash_register?.store?.name || '-'}
              </span>
            </div>
            <div className="cash-register-summary-modal__info-item">
              <span className="cash-register-summary-modal__info-label">Usuario:</span>
              <span className="cash-register-summary-modal__info-value">
                {cashRegisterSession.user?.username || '-'}
              </span>
            </div>
            <div className="cash-register-summary-modal__info-item">
              <span className="cash-register-summary-modal__info-label">Apertura:</span>
              <span className="cash-register-summary-modal__info-value">
                {formatDate(cashRegisterSession.opened_at)}
              </span>
            </div>
            {cashRegisterSession.closed_at && (
              <div className="cash-register-summary-modal__info-item">
                <span className="cash-register-summary-modal__info-label">Cierre:</span>
                <span className="cash-register-summary-modal__info-value">
                  {formatDate(cashRegisterSession.closed_at)}
                </span>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="cash-register-summary-modal__loading">
              <div className="cash-register-summary-modal__spinner"></div>
              <p>Cargando resumen...</p>
            </div>
          ) : (
            <>
              <div className="cash-register-summary-modal__grid">
                <div className="cash-register-summary-modal__card cash-register-summary-modal__card--opening">
                  <div className="cash-register-summary-modal__card-icon">
                    <MuiSvgIcon size={24}>lucide:arrow-right-left</MuiSvgIcon>
                  </div>
                  <div className="cash-register-summary-modal__card-info">
                    <p className="cash-register-summary-modal__card-title">Monto Apertura</p>
                    <p className="cash-register-summary-modal__card-value">
                      {formatAmount(summary?.summary.opening_amount)}
                    </p>
                  </div>
                </div>

                <div className="cash-register-summary-modal__card cash-register-summary-modal__card--income">
                  <div className="cash-register-summary-modal__card-icon">
                    <MuiSvgIcon size={24}>lucide:trending-up</MuiSvgIcon>
                  </div>
                  <div className="cash-register-summary-modal__card-info">
                    <p className="cash-register-summary-modal__card-title">Total Ingresos</p>
                    <p className="cash-register-summary-modal__card-value cash-register-summary-modal__card-value--income">
                      {formatAmount(summary?.summary.total_income)}
                    </p>
                  </div>
                </div>

                <div className="cash-register-summary-modal__card cash-register-summary-modal__card--expense">
                  <div className="cash-register-summary-modal__card-icon">
                    <MuiSvgIcon size={24}>lucide:trending-down</MuiSvgIcon>
                  </div>
                  <div className="cash-register-summary-modal__card-info">
                    <p className="cash-register-summary-modal__card-title">Total Egresos</p>
                    <p className="cash-register-summary-modal__card-value cash-register-summary-modal__card-value--expense">
                      {formatAmount(summary?.summary.total_expense)}
                    </p>
                  </div>
                </div>

                <div className="cash-register-summary-modal__card cash-register-summary-modal__card--expected">
                  <div className="cash-register-summary-modal__card-icon">
                    <MuiSvgIcon size={24}>lucide:calculator</MuiSvgIcon>
                  </div>
                  <div className="cash-register-summary-modal__card-info">
                    <p className="cash-register-summary-modal__card-title">Monto Esperado</p>
                    <p className="cash-register-summary-modal__card-value cash-register-summary-modal__card-value--expected">
                      {formatAmount(summary?.summary.expected_amount)}
                    </p>
                  </div>
                </div>

                {cashRegisterSession.status === 'closed' && (
                  <div className="cash-register-summary-modal__card cash-register-summary-modal__card--closing">
                    <div className="cash-register-summary-modal__card-icon">
                      <MuiSvgIcon size={24}>lucide:lock</MuiSvgIcon>
                    </div>
                    <div className="cash-register-summary-modal__card-info">
                      <p className="cash-register-summary-modal__card-title">Monto Cierre</p>
                      <p className="cash-register-summary-modal__card-value">
                        {formatAmount(summary?.summary.closing_amount)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="cash-register-summary-modal__card cash-register-summary-modal__card--difference">
                  <div className="cash-register-summary-modal__card-icon">
                    <MuiSvgIcon size={24}>lucide:scale</MuiSvgIcon>
                  </div>
                  <div className="cash-register-summary-modal__card-info">
                    <p className="cash-register-summary-modal__card-title">Diferencia</p>
                    <p className={`cash-register-summary-modal__card-value ${summary?.summary.difference_amount !== 0 ? 'cash-register-summary-modal__card-value--warning' : ''}`}>
                      {formatAmount(summary?.summary.difference_amount)}
                    </p>
                  </div>
                </div>
              </div>

              {cashRegisterSession.notes && (
                <div className="cash-register-summary-modal__notes">
                  <h4 className="cash-register-summary-modal__notes-title">Notas</h4>
                  <p className="cash-register-summary-modal__notes-text">{cashRegisterSession.notes}</p>
                </div>
              )}
            </>
          )}
        </div>
    </AppModal>
  )
}