import { useState, useEffect } from "react"
import { useCashRegisterSummary } from "../hooks/useCashRegisterSummary"
import type { CashRegister, CashRegisterSummary } from "../types/cash-registers.types"
import MuiSvgIcon from "@/components/MuiSvgIcon"

interface CashRegisterCloseFormProps {
  cashRegister: CashRegister
  onSubmit: (data: any) => void
  onCancel: () => void
  isSubmitting?: boolean
}

const formatAmount = (amount: number | null) => {
  if (amount === null) return '-'
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(amount)
}

export const CashRegisterCloseForm = ({ 
  cashRegister, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}: CashRegisterCloseFormProps) => {
  const { data: summary, isLoading } = useCashRegisterSummary(cashRegister.id)
  console.log(summary)
  const [closingAmount, setClosingAmount] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

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

    onSubmit({
      closing_amount: parseFloat(closingAmount)
    })
  }

  if (isLoading) {
    return (
      <div className="cash-register-close-form__loading">
        <div className="cash-register-close-form__spinner"></div>
        <p>Cargando resumen de la caja...</p>
      </div>
    )
  }

  const summaryData = summary?.summary

  return (
    <form className="cash-register-close-form" onSubmit={handleSubmit}>
      <div className="cash-register-close-form__summary">
        <h3 className="cash-register-close-form__summary-title">
          Resumen de la Caja
        </h3>
        
        <div className="cash-register-close-form__summary-grid">
          <div className="cash-register-close-form__summary-item">
            <span className="cash-register-close-form__summary-label">Monto de Apertura</span>
            <span className="cash-register-close-form__summary-value">
              {formatAmount(summaryData?.opening_amount)}
            </span>
          </div>
          <div className="cash-register-close-form__summary-item">
            <span className="cash-register-close-form__summary-label">Total Ingresos</span>
            <span className="cash-register-close-form__summary-value cash-register-close-form__summary-value--income">
              {formatAmount(summaryData?.total_income)}
            </span>
          </div>
          <div className="cash-register-close-form__summary-item">
            <span className="cash-register-close-form__summary-label">Total Egresos</span>
            <span className="cash-register-close-form__summary-value cash-register-close-form__summary-value--expense">
              {formatAmount(summaryData?.total_expense)}
            </span>
          </div>
          <div className="cash-register-close-form__summary-item cash-register-close-form__summary-item--expected">
            <span className="cash-register-close-form__summary-label">Monto Esperado</span>
            <span className="cash-register-close-form__summary-value cash-register-close-form__summary-value--expected">
              {formatAmount(summaryData?.expected_amount)}
            </span>
          </div>
        </div>
      </div>

      <div className="cash-register-close-form__field">
        <label className="cash-register-close-form__label">
          Monto de Cierre <span className="cash-register-close-form__required">*</span>
        </label>
        <div className="cash-register-close-form__amount-input">
          <span className="cash-register-close-form__currency">S/</span>
          <input
            type="number"
            name="closing_amount"
            step="0.01"
            min="0"
            placeholder="0.00"
            className={`cash-register-close-form__input ${errors.closing_amount ? 'cash-register-close-form__input--error' : ''}`}
            value={closingAmount}
            onChange={(e) => setClosingAmount(e.target.value)}
          />
        </div>
        {errors.closing_amount && <span className="cash-register-close-form__error">{errors.closing_amount}</span>}
      </div>

      <div className="cash-register-close-form__difference">
        {summaryData && closingAmount && !errors.closing_amount && (
          <>
            <div className="cash-register-close-form__difference-item">
              <span className="cash-register-close-form__difference-label">Diferencia</span>
              <span className={`cash-register-close-form__difference-value ${parseFloat(closingAmount) !== summaryData.expected_amount ? 'cash-register-close-form__difference-value--warning' : ''}`}>
                {formatAmount(parseFloat(closingAmount) - summaryData.expected_amount)}
              </span>
            </div>
            {parseFloat(closingAmount) !== summaryData.expected_amount && (
              <p className="cash-register-close-form__difference-warning">
                <MuiSvgIcon size={16}>lucide:alert-triangle</MuiSvgIcon>
                La diferencia no es cero. Verifique el conteo de efectivo.
              </p>
            )}
          </>
        )}
      </div>

      <div className="cash-register-close-form__actions">
        <button
          type="button"
          className="cash-register-close-form__button cash-register-close-form__button--secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="cash-register-close-form__button cash-register-close-form__button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="cash-register-close-form__spinner"></span>
              Cerrando caja...
            </>
          ) : (
            'Cerrar Caja'
          )}
        </button>
      </div>
    </form>
  )
}