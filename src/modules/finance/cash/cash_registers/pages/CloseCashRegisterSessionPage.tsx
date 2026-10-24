import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useCashRegisterSessionSummary } from "../hooks/useCashRegisterSessionSummary"
import { useCloseCashRegisterSession } from "../hooks/useCloseCashRegisterSession"
import { CashRegisterSkeleton } from "../components/CashRegisterSkeleton"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/cash-registers.scss"

export const CloseCashRegisterSessionPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [closingAmount, setClosingAmount] = useState("")
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: summary, isLoading } = useCashRegisterSessionSummary(Number(id))
  const { mutate: closeSession, isPending } = useCloseCashRegisterSession()

  useEffect(() => {
    if (summary?.summary.expected_amount) {
      setClosingAmount(summary.summary.expected_amount.toString())
    }
  }, [summary])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!closingAmount) {
      newErrors.closing_amount = "El monto de cierre es requerido"
    } else {
      const amount = parseFloat(closingAmount)
      if (isNaN(amount)) {
        newErrors.closing_amount = "Ingrese un valor numérico válido"
      } else if (amount < 0) {
        newErrors.closing_amount = "El monto no puede ser negativo"
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    closeSession({
      id: Number(id),
      data: {
        closing_amount: parseFloat(closingAmount),
        notes: notes || null
      }
    }, {
      onSuccess: () => {
        navigate('/cash-register/sessions')
      }
    })
  }

  if (isLoading) {
    return <CashRegisterSkeleton />
  }

  if (!summary) {
    return (
      <div className="cash-register-error">
        <div className="cash-register-error__content">
          <h2>Sesión no encontrada</h2>
          <button onClick={() => navigate('/cash-register/sessions')}>
            Volver a Sesiones
          </button>
        </div>
      </div>
    )
  }

  if (summary.session.status === 'closed') {
    return (
      <div className="cash-register-error">
        <div className="cash-register-error__content">
          <h2>Esta sesión ya está cerrada</h2>
          <button onClick={() => navigate('/cash-register/sessions')}>
            Volver a Sesiones
          </button>
        </div>
      </div>
    )
  }
  console.log(closingAmount)

  const session = summary.session
  const sessionSummary = summary.summary

  return (
    <div className="close-cash-register-page">
      <div className="close-cash-register-page__header">
        <button 
          className="close-cash-register-page__back-btn"
          onClick={() => navigate('/cash-register/sessions')}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div>
          <h1 className="close-cash-register-page__title">Cerrar Caja</h1>
          <p className="close-cash-register-page__subtitle">
            {session.cash_register?.name} - {new Date(session.opened_at).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="close-cash-register-page__summary">
        <h3 className="close-cash-register-page__summary-title">Resumen de la Sesión</h3>
        
        <div className="close-cash-register-page__summary-grid">
          <div className="close-cash-register-page__summary-card">
            <div className="close-cash-register-page__summary-icon">
              <MuiSvgIcon size={24}>lucide:arrow-right-left</MuiSvgIcon>
            </div>
            <div>
              <p className="close-cash-register-page__summary-label">Monto de Apertura</p>
              <p className="close-cash-register-page__summary-value">
                S/ {sessionSummary.opening_amount.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="close-cash-register-page__summary-card">
            <div className="close-cash-register-page__summary-icon close-cash-register-page__summary-icon--income">
              <MuiSvgIcon size={24}>lucide:trending-up</MuiSvgIcon>
            </div>
            <div>
              <p className="close-cash-register-page__summary-label">Total Ingresos</p>
              <p className="close-cash-register-page__summary-value close-cash-register-page__summary-value--income">
                S/ {sessionSummary.total_income.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="close-cash-register-page__summary-card">
            <div className="close-cash-register-page__summary-icon close-cash-register-page__summary-icon--expense">
              <MuiSvgIcon size={24}>lucide:trending-down</MuiSvgIcon>
            </div>
            <div>
              <p className="close-cash-register-page__summary-label">Total Egresos</p>
              <p className="close-cash-register-page__summary-value close-cash-register-page__summary-value--expense">
                S/ {sessionSummary.total_expense.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="close-cash-register-page__summary-card close-cash-register-page__summary-card--expected">
            <div className="close-cash-register-page__summary-icon close-cash-register-page__summary-icon--expected">
              <MuiSvgIcon size={24}>lucide:calculator</MuiSvgIcon>
            </div>
            <div>
              <p className="close-cash-register-page__summary-label">Monto Esperado</p>
              <p className="close-cash-register-page__summary-value close-cash-register-page__summary-value--expected">
                S/ {sessionSummary.expected_amount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <form className="close-cash-register-form" onSubmit={handleSubmit}>
        <div className="close-cash-register-form__field">
          <label className="close-cash-register-form__label">
            Monto de Cierre <span className="close-cash-register-form__required">*</span>
          </label>
          <div className="close-cash-register-form__amount-input">
            <span className="close-cash-register-form__currency">S/</span>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={closingAmount}
              onChange={(e) => setClosingAmount(e.target.value)}
              className={errors.closing_amount ? 'error' : ''}
            />
          </div>
          {errors.closing_amount && <span className="close-cash-register-form__error">{errors.closing_amount}</span>}
        </div>

        <div className="close-cash-register-form__difference">
          {closingAmount && !errors.closing_amount && (
            <>
              <div className="close-cash-register-form__difference-item">
                <span className="close-cash-register-form__difference-label">Diferencia</span>
                <span className={`close-cash-register-form__difference-value ${parseFloat(closingAmount) !== sessionSummary.expected_amount ? 'close-cash-register-form__difference-value--warning' : ''}`}>
                  S/ {(parseFloat(closingAmount) - sessionSummary.expected_amount).toFixed(2)}
                </span>
              </div>
              {parseFloat(closingAmount) !== sessionSummary.expected_amount && (
                <p className="close-cash-register-form__difference-warning">
                  <MuiSvgIcon size={16}>lucide:alert-triangle</MuiSvgIcon>
                  La diferencia no es cero. Verifique el conteo de efectivo.
                </p>
              )}
            </>
          )}
        </div>

        <div className="close-cash-register-form__field">
          <label className="close-cash-register-form__label">Notas</label>
          <textarea
            rows={3}
            placeholder="Notas adicionales sobre el cierre..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="close-cash-register-form__actions">
          <button
            type="button"
            className="close-cash-register-form__btn close-cash-register-form__btn--secondary"
            onClick={() => navigate('/cash-register/sessions')}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="close-cash-register-form__btn close-cash-register-form__btn--primary"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="close-cash-register-form__spinner"></span>
                Cerrando caja...
              </>
            ) : (
              'Cerrar Caja'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}