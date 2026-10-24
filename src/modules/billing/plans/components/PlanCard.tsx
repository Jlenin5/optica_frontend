import { useState } from "react"
import { useDeletePlan } from "../hooks/useDeletePlan"
import { useTogglePlanStatus } from "../hooks/useTogglePlanStatus"
import { useTogglePlanVisibility } from "../hooks/useTogglePlanVisibility"
import type { Plan } from "../types/plans.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { useNavigate } from "react-router-dom"

interface PlanCardProps {
  plan: Plan
  onEdit: (plan: Plan) => void
  onRefresh: () => void
  viewMode: 'grid' | 'list'
}

const getBillingCycleLabel = (cycle: string): string => {
  const labels: Record<string, string> = {
    monthly: 'Mensual',
    quarterly: 'Trimestral',
    semiannual: 'Semestral',
    annual: 'Anual'
  }
  return labels[cycle] || cycle
}

const formatPrice = (price: string): string => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(Number(price))
}

export const PlanCard = ({ plan, onEdit, onRefresh, viewMode }: PlanCardProps) => {
  const { mutate: deletePlan } = useDeletePlan()
  const { mutate: toggleStatus } = useTogglePlanStatus()
  const { mutate: toggleVisibility } = useTogglePlanVisibility()
  const [isDeletingLocal, setIsDeletingLocal] = useState(false)
  const navigate = useNavigate()

  const handleDelete = () => {
    if (confirm("¿Estás seguro de que deseas eliminar este plan?")) {
      setIsDeletingLocal(true)
      deletePlan(plan.id, {
        onSuccess: () => {
          onRefresh()
        },
        onSettled: () => {
          setIsDeletingLocal(false)
        }
      })
    }
  }

  const handleToggleStatus = () => {
    toggleStatus({ id: plan.id, status: !plan.status }, {
      onSuccess: () => onRefresh()
    })
  }

  const handleToggleVisibility = () => {
    toggleVisibility({ id: plan.id, is_public: !plan.is_public }, {
      onSuccess: () => onRefresh()
    })
  }

  if (viewMode === 'list') {
    return (
      <div className="plan-card plan-card--list">
        <div className="plan-card__header">
          <div className="plan-card__info">
            <div className="plan-card__badges">
              <span className={`plan-card__badge plan-card__badge--${plan.status ? 'active' : 'inactive'}`}>
                {plan.status ? 'Activo' : 'Inactivo'}
              </span>
              <span className={`plan-card__badge plan-card__badge--${plan.is_public ? 'public' : 'private'}`}>
                {plan.is_public ? 'Público' : 'Privado'}
              </span>
            </div>
            <h3 className="plan-card__name">{plan.name}</h3>
            <span className="plan-card__code">{plan.code}</span>
          </div>
          <div className="plan-card__price">
            <span className="plan-card__price-amount">{formatPrice(plan.price)}</span>
            <span className="plan-card__price-cycle">/{getBillingCycleLabel(plan.billing_cycle)}</span>
          </div>
        </div>

        {plan.description && (
          <p className="plan-card__description">{plan.description}</p>
        )}

        <div className="plan-card__footer">
          <div className="plan-card__actions">
            <button 
              className="plan-card__action plan-card__action--edit"
              onClick={() => onEdit(plan)}
            >
              <MuiSvgIcon size={18}>
                heroicons-outline:pencil-square
              </MuiSvgIcon>
              Editar
            </button>
            <button 
              className={`plan-card__action plan-card__action--${plan.status ? 'disable' : 'enable'}`}
              onClick={handleToggleStatus}
            >
              <MuiSvgIcon size={18}>
                {plan.status ? 'lucide:eye-off' : 'lucide:eye'}
              </MuiSvgIcon>
              {plan.status ? 'Desactivar' : 'Activar'}
            </button>
            <button 
              className="plan-card__action plan-card__action--features"
              onClick={() => navigate(`/billing/plan-features/${plan.id}`)}
            >
              <MuiSvgIcon size={18}>lucide:sparkles</MuiSvgIcon>
              Características
            </button>
            <button 
              className="plan-card__action plan-card__action--limits"
              onClick={() => navigate(`/billing/plan-limits/${plan.id}`)}
            >
              <MuiSvgIcon size={18}>lucide:settings</MuiSvgIcon>
              Límites
            </button>
            <button 
              className="plan-card__action plan-card__action--delete"
              onClick={handleDelete}
              disabled={isDeletingLocal}
            >
              {isDeletingLocal ? (
                <span className="plan-card__spinner"></span>
              ) : (
                <MuiSvgIcon size={18}>lucide:trash-2</MuiSvgIcon>
              )}
              Eliminar
            </button>
          </div>
          <button 
            className={`plan-card__visibility ${plan.is_public ? 'plan-card__visibility--public' : 'plan-card__visibility--private'}`}
            onClick={handleToggleVisibility}
            title={plan.is_public ? 'Hacer privado' : 'Hacer público'}
          >
            <MuiSvgIcon size={16}>
              {plan.is_public ? 'lucide:globe' : 'lucide:lock'}
            </MuiSvgIcon>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="plan-card">
      <div className="plan-card__header">
        <div className="plan-card__badges">
          <span className={`plan-card__badge plan-card__badge--${plan.status ? 'active' : 'inactive'}`}>
            {plan.status ? 'Activo' : 'Inactivo'}
          </span>
          <span className={`plan-card__badge plan-card__badge--${plan.is_public ? 'public' : 'private'}`}>
            {plan.is_public ? 'Público' : 'Privado'}
          </span>
        </div>
        <button 
          className="plan-card__visibility-btn"
          onClick={handleToggleVisibility}
          title={plan.is_public ? 'Hacer privado' : 'Hacer público'}
        >
          <MuiSvgIcon size={18}>
            {plan.is_public ? 'lucide:globe' : 'lucide:lock'}
          </MuiSvgIcon>
        </button>
      </div>

      <div className="plan-card__body">
        <h3 className="plan-card__name">{plan.name}</h3>
        <span className="plan-card__code">{plan.code}</span>
        
        <div className="plan-card__price">
          <span className="plan-card__price-amount">{formatPrice(plan.price)}</span>
          <span className="plan-card__price-cycle">/{getBillingCycleLabel(plan.billing_cycle)}</span>
        </div>

        {plan.description && (
          <p className="plan-card__description">{plan.description}</p>
        )}
      </div>

      <div className="plan-card__footer">
        <button 
          className="plan-card__btn plan-card__btn--edit"
          onClick={() => onEdit(plan)}
        >
          <MuiSvgIcon size={18}>
            heroicons-outline:pencil-square
          </MuiSvgIcon>
          Editar
        </button>
        <button 
          className={`plan-card__btn plan-card__btn--${plan.status ? 'disable' : 'enable'}`}
          onClick={handleToggleStatus}
        >
          <MuiSvgIcon size={18}>
            {plan.status ? 'lucide:eye-off' : 'lucide:eye'}
          </MuiSvgIcon>
          {plan.status ? 'Desactivar' : 'Activar'}
        </button>
        <button 
          className="plan-card__btn plan-card__btn--features"
          onClick={() => navigate(`/billing/plan-features/${plan.id}`)}
        >
          <MuiSvgIcon size={18}>lucide:sparkles</MuiSvgIcon>
          Características
        </button>
        <button 
          className="plan-card__btn plan-card__btn--limits"
          onClick={() => navigate(`/billing/plan-limits/${plan.id}`)}
        >
          <MuiSvgIcon size={18}>lucide:settings</MuiSvgIcon>
          Límites
        </button>
        <button 
          className="plan-card__btn plan-card__btn--delete"
          onClick={handleDelete}
          disabled={isDeletingLocal}
        >
          {isDeletingLocal ? (
            <span className="plan-card__spinner"></span>
          ) : (
            <MuiSvgIcon size={18}>lucide:trash-2</MuiSvgIcon>
          )}
          Eliminar
        </button>
      </div>
    </div>
  )
}