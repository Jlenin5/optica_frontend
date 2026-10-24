import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCashRegisters } from "../hooks/useCashRegisters"
import { useActiveSession } from "../hooks/useActiveSession"
import { useOpenCashRegister } from "../hooks/useOpenCashRegister"
import { CashRegisterSelector } from "../components/CashRegisterSelector"
import { CashRegisterSkeleton } from "../components/CashRegisterSkeleton"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/cash-registers.scss"

export const OpenCashRegisterPage = () => {
  const navigate = useNavigate()
  const [selectedRegisterId, setSelectedRegisterId] = useState<number | null>(null)
  const [openingAmount, setOpeningAmount] = useState("")
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: registersData, isLoading: registersLoading } = useCashRegisters({
    status: true,
    // limit: 100
  })
  const { data: activeSession, isLoading: sessionLoading } = useActiveSession()
  const { mutate: openRegister, isPending } = useOpenCashRegister()

  const registers = registersData?.pages.flatMap(page => page.results) || []
  const selectedRegister = registers.find(r => r.id === selectedRegisterId)

  // Si ya hay una sesión activa, redirigir
  if (activeSession && !sessionLoading) {
    return (
      <div className="cash-register-alert">
        <div className="cash-register-alert__content">
          <MuiSvgIcon size={48}>lucide:alert-circle</MuiSvgIcon>
          <h2>Ya tienes una caja abierta</h2>
          <p>Tienes una sesión activa desde {new Date(activeSession.opened_at).toLocaleString()}</p>
          <p>Caja: {activeSession.cash_register?.name}</p>
          <div className="cash-register-alert__actions">
            <button onClick={() => navigate('/cash-register/sessions')}>
              Ver mis sesiones
            </button>
            <button onClick={() => navigate(`/cash-register/sessions/${activeSession.id}/close`)}>
              Cerrar caja actual
            </button>
          </div>
        </div>
      </div>
    )
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!selectedRegisterId) {
      newErrors.register = "Debe seleccionar una caja"
    }
    
    if (!openingAmount) {
      newErrors.opening_amount = "El monto de apertura es requerido"
    } else {
      const amount = parseFloat(openingAmount)
      if (isNaN(amount)) {
        newErrors.opening_amount = "Ingrese un valor numérico válido"
      } else if (amount < 0) {
        newErrors.opening_amount = "El monto no puede ser negativo"
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || !selectedRegisterId) return

    openRegister({
      cash_register_id: selectedRegisterId,
      opening_amount: parseFloat(openingAmount),
      notes: notes || null
    }, {
      onSuccess: () => {
        navigate('/cash-register/sessions')
      }
    })
  }

  if (registersLoading || sessionLoading) {
    return <CashRegisterSkeleton />
  }

  return (
    <div className="open-cash-register-page">
      <div className="open-cash-register-page__header">
        <button 
          className="open-cash-register-page__back-btn"
          onClick={() => navigate('/cash-register/sessions')}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div>
          <h1 className="open-cash-register-page__title">Abrir Caja</h1>
        </div>
      </div>

      <form className="open-cash-register-form" onSubmit={handleSubmit}>
        <div className="open-cash-register-form__field">
          <label className="open-cash-register-form__label">
            Seleccionar Caja <span className="open-cash-register-form__required">*</span>
          </label>
          <CashRegisterSelector
            registers={registers}
            value={selectedRegisterId}
            onChange={setSelectedRegisterId}
            error={errors.register}
          />
        </div>

        {selectedRegister && (
          <div className="open-cash-register-form__info">
            <div className="open-cash-register-form__info-item">
              <span className="open-cash-register-form__info-label">Tienda:</span>
              <span className="open-cash-register-form__info-value">
                {selectedRegister.store?.name || '-'}
              </span>
            </div>
            {selectedRegister.description && (
              <div className="open-cash-register-form__info-item">
                <span className="open-cash-register-form__info-label">Descripción:</span>
                <span className="open-cash-register-form__info-value">
                  {selectedRegister.description}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="open-cash-register-form__field">
          <label className="open-cash-register-form__label">
            Monto de Apertura <span className="open-cash-register-form__required">*</span>
          </label>
          <div className="open-cash-register-form__amount-input">
            <span className="open-cash-register-form__currency">S/</span>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={openingAmount}
              onChange={(e) => setOpeningAmount(e.target.value)}
              className={errors.opening_amount ? 'error' : ''}
            />
          </div>
          {errors.opening_amount && <span className="open-cash-register-form__error">{errors.opening_amount}</span>}
        </div>

        <div className="open-cash-register-form__field">
          <label className="open-cash-register-form__label">Notas</label>
          <textarea
            rows={3}
            placeholder="Notas adicionales..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="open-cash-register-form__actions">
          <button
            type="button"
            className="open-cash-register-form__btn open-cash-register-form__btn--secondary"
            onClick={() => navigate('/cash-register/sessions')}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="open-cash-register-form__btn open-cash-register-form__btn--primary"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="open-cash-register-form__spinner"></span>
                Abriendo caja...
              </>
            ) : (
              'Abrir Caja'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}