import { useParams, useNavigate } from "react-router-dom"
import { useCashRegister } from "../hooks/useCashRegister"
import { useCloseCashRegister } from "../hooks/useCloseCashRegister"
import { CashRegisterCloseForm } from "../components/CashRegisterCloseForm"
import { CashRegisterSkeleton } from "../components/CashRegisterSkeleton"
import "@styles/cash-registers.scss"

export const CashRegisterClosePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: cashRegister, isLoading } = useCashRegister(Number(id))
  const { mutate: closeCashRegister, isPending } = useCloseCashRegister()

  const handleSubmit = (data: any) => {
    if (!cashRegister) return
    closeCashRegister(
      { id: cashRegister.id, data },
      {
        onSuccess: () => {
          navigate('/finance/cash-registers')
        }
      }
    )
  }

  if (isLoading) {
    return <CashRegisterSkeleton />
  }

  if (!cashRegister) {
    return (
      <div className="cash-register-error">
        <div className="cash-register-error__content">
          <h2>Caja no encontrada</h2>
          <button onClick={() => navigate('/finance/cash-registers')}>
            Volver a Cajas
          </button>
        </div>
      </div>
    )
  }

  if (cashRegister.status === false) {
    return (
      <div className="cash-register-error">
        <div className="cash-register-error__content">
          <h2>Esta caja ya está cerrada</h2>
          <button onClick={() => navigate('/finance/cash-registers')}>
            Volver a Cajas
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cash-register-close-page">
      <div className="cash-register-close-page__header">
        <button 
          className="cash-register-close-page__back-btn"
          onClick={() => navigate('/finance/cash-registers')}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div>
          <h1 className="cash-register-close-page__title">Cerrar Caja</h1>
          <p className="cash-register-close-page__subtitle">
            {cashRegister.name || `Caja #${cashRegister.id}`}
          </p>
        </div>
      </div>

      <div className="cash-register-close-page__content">
        <CashRegisterCloseForm
          cashRegister={cashRegister}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/finance/cash-registers')}
          isSubmitting={isPending}
        />
      </div>
    </div>
  )
}