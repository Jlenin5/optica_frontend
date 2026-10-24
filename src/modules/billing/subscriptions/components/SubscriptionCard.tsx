// modules/subscriptions/components/SubscriptionCard.tsx (actualizado)
import { useState } from "react"
import { useCancelSubscription } from "../hooks/useCancelSubscription"
import { useRenewSubscription } from "../hooks/useRenewSubscription"
import { useActivateSubscription } from "../hooks/useActivateSubscription"
import type { Subscription, SubscriptionStatus } from "../types/subscriptions.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface SubscriptionCardProps {
  subscription: Subscription
  onRefresh: () => void
  viewMode: 'grid' | 'list'
}

const getStatusConfig = (status: SubscriptionStatus) => {
  const configs = {
    active: {
      label: 'Activa',
      icon: 'lucide:check-circle',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      description: 'Suscripción activa y funcionando correctamente'
    },
    trial: {
      label: 'Trial',
      icon: 'lucide:clock',
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
      description: 'Período de prueba activo'
    },
    past_due: {
      label: 'Pendiente',
      icon: 'lucide:alert-circle',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      description: 'Pago pendiente - requiere acción'
    },
    canceled: {
      label: 'Cancelada',
      icon: 'lucide:x-circle',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      description: 'Suscripción cancelada'
    }
  }
  return configs[status]
}

const formatDate = (date: string | null) => {
  if (!date) return 'No definida'
  return format(new Date(date), "dd 'de' MMMM yyyy", { locale: es })
}

const getDaysRemaining = (endDate: string | null) => {
  if (!endDate) return null
  const end = new Date(endDate)
  const now = new Date()
  const diffTime = end.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const getTrialDaysRemaining = (trialEnd: string | null) => {
  if (!trialEnd) return null
  const end = new Date(trialEnd)
  const now = new Date()
  const diffTime = end.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export const SubscriptionCard = ({ subscription, onRefresh, viewMode }: SubscriptionCardProps) => {
  const { mutate: cancelSubscription } = useCancelSubscription()
  const { mutate: renewSubscription } = useRenewSubscription()
  const { mutate: activateSubscription } = useActivateSubscription()
  const [isCancelingLocal, setIsCancelingLocal] = useState(false)
  const [isRenewingLocal, setIsRenewingLocal] = useState(false)
  const [isActivatingLocal, setIsActivatingLocal] = useState(false)

  const statusConfig = getStatusConfig(subscription.status)
  const daysRemaining = getDaysRemaining(subscription.end_date)
  const trialDaysRemaining = getTrialDaysRemaining(subscription.trial_end)
  const isExpiringSoon = daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0
  const isExpired = daysRemaining !== null && daysRemaining <= 0
  const isTrialExpiringSoon = trialDaysRemaining !== null && trialDaysRemaining <= 3 && trialDaysRemaining > 0

  const handleCancel = () => {
    if (confirm("¿Estás seguro de que deseas cancelar esta suscripción?")) {
      setIsCancelingLocal(true)
      cancelSubscription(subscription.id, {
        onSuccess: () => {
          onRefresh()
        },
        onSettled: () => {
          setIsCancelingLocal(false)
        }
      })
    }
  }

  const handleRenew = () => {
    if (confirm("¿Estás seguro de que deseas renovar esta suscripción?")) {
      setIsRenewingLocal(true)
      renewSubscription(subscription.id, {
        onSuccess: () => {
          onRefresh()
        },
        onSettled: () => {
          setIsRenewingLocal(false)
        }
      })
    }
  }

  const handleActivate = () => {
    if (confirm("¿Estás seguro de que deseas activar esta suscripción?")) {
      setIsActivatingLocal(true)
      activateSubscription(subscription.id, {
        onSuccess: () => {
          onRefresh()
        },
        onSettled: () => {
          setIsActivatingLocal(false)
        }
      })
    }
  }

  // Renderizado para vista lista (mantener igual pero con nuevos botones)
  if (viewMode === 'list') {
    return (
      <div className="subscription-card subscription-card--list">
        <div className="subscription-card__header">
          <div className="subscription-card__company">
            <div className="subscription-card__company-avatar">
              <MuiSvgIcon size={24}>heroicons-outline:building-office</MuiSvgIcon>
            </div>
            <div>
              <h3 className="subscription-card__company-name">{subscription.company.name}</h3>
              <span className="subscription-card__company-ruc">RUC: {subscription.company.ruc}</span>
            </div>
          </div>
          <div className="subscription-card__plan">
            <span className="subscription-card__plan-name">{subscription.plan.name}</span>
            <span className="subscription-card__plan-price">
              S/ {subscription.plan.price}
              <span className="subscription-card__plan-cycle">/{subscription.plan.billing_cycle === 'monthly' ? 'mes' : subscription.plan.billing_cycle}</span>
            </span>
          </div>
        </div>

        <div className="subscription-card__body">
          <div className="subscription-card__dates">
            <div className="subscription-card__date">
              <MuiSvgIcon size={16}>lucide:calendar</MuiSvgIcon>
              <span>Inicio: {formatDate(subscription.start_date)}</span>
            </div>
            <div className="subscription-card__date">
              <MuiSvgIcon size={16}>lucide:calendar</MuiSvgIcon>
              <span>Fin: {formatDate(subscription.end_date)}</span>
            </div>
            {subscription.trial_end && (
              <div className="subscription-card__date">
                <MuiSvgIcon size={16}>lucide:clock</MuiSvgIcon>
                <span>Trial hasta: {formatDate(subscription.trial_end)}</span>
              </div>
            )}
          </div>

          {/* Mensajes según el estado */}
          {subscription.status === 'trial' && trialDaysRemaining !== null && (
            <div className={`subscription-card__days-remaining subscription-card__days-remaining--trial ${isTrialExpiringSoon ? 'subscription-card__days-remaining--warning' : ''}`}>
              <MuiSvgIcon size={16}>lucide:clock</MuiSvgIcon>
              <span>
                {isTrialExpiringSoon 
                  ? `¡El período de prueba termina en ${trialDaysRemaining} días!` 
                  : `${trialDaysRemaining} días de prueba restantes`}
              </span>
            </div>
          )}

          {subscription.status === 'past_due' && (
            <div className="subscription-card__days-remaining subscription-card__days-remaining--past-due">
              <MuiSvgIcon size={16}>lucide:alert-triangle</MuiSvgIcon>
              <span>Pago pendiente - La suscripción será cancelada pronto</span>
            </div>
          )}

          {subscription.status === 'active' && daysRemaining !== null && (
            <div className={`subscription-card__days-remaining ${isExpiringSoon ? 'subscription-card__days-remaining--warning' : ''} ${isExpired ? 'subscription-card__days-remaining--expired' : ''}`}>
              <MuiSvgIcon size={16}>lucide:hourglass</MuiSvgIcon>
              <span>
                {isExpired ? 'Suscripción expirada' : `${daysRemaining} días restantes`}
              </span>
            </div>
          )}
        </div>

        <div className="subscription-card__footer">
          <div className="subscription-card__status">
            <span 
              className="subscription-card__status-badge"
              style={{ backgroundColor: statusConfig.bgColor, color: statusConfig.color }}
              title={statusConfig.description}
            >
              <MuiSvgIcon size={14}>{statusConfig.icon}</MuiSvgIcon>
              {statusConfig.label}
            </span>
          </div>
          <div className="subscription-card__actions">
            {/* Acciones para estado Trial */}
            {subscription.status === 'trial' && (
              <>
                <button 
                  className="subscription-card__action subscription-card__action--activate"
                  onClick={handleActivate}
                  disabled={isActivatingLocal}
                >
                  {isActivatingLocal ? (
                    <span className="subscription-card__spinner"></span>
                  ) : (
                    <MuiSvgIcon size={18}>lucide:play-circle</MuiSvgIcon>
                  )}
                  Activar
                </button>
                <button 
                  className="subscription-card__action subscription-card__action--cancel"
                  onClick={handleCancel}
                  disabled={isCancelingLocal}
                >
                  {isCancelingLocal ? (
                    <span className="subscription-card__spinner"></span>
                  ) : (
                    <MuiSvgIcon size={18}>lucide:x-circle</MuiSvgIcon>
                  )}
                  Cancelar
                </button>
              </>
            )}

            {/* Acciones para estado Past Due */}
            {subscription.status === 'past_due' && (
              <>
                <button 
                  className="subscription-card__action subscription-card__action--renew"
                  onClick={handleRenew}
                  disabled={isRenewingLocal}
                >
                  {isRenewingLocal ? (
                    <span className="subscription-card__spinner"></span>
                  ) : (
                    <MuiSvgIcon size={18}>lucide:credit-card</MuiSvgIcon>
                  )}
                  Pagar y Renovar
                </button>
                <button 
                  className="subscription-card__action subscription-card__action--cancel"
                  onClick={handleCancel}
                  disabled={isCancelingLocal}
                >
                  {isCancelingLocal ? (
                    <span className="subscription-card__spinner"></span>
                  ) : (
                    <MuiSvgIcon size={18}>lucide:x-circle</MuiSvgIcon>
                  )}
                  Cancelar
                </button>
              </>
            )}

            {/* Acciones para estado Active */}
            {subscription.status === 'active' && (
              <button 
                className="subscription-card__action subscription-card__action--cancel"
                onClick={handleCancel}
                disabled={isCancelingLocal}
              >
                {isCancelingLocal ? (
                  <span className="subscription-card__spinner"></span>
                ) : (
                  <MuiSvgIcon size={18}>lucide:x-circle</MuiSvgIcon>
                )}
                Cancelar
              </button>
            )}

            {(subscription.status === 'canceled' || (subscription.status === 'active' && isExpired)) && (
              <button 
                className="subscription-card__action subscription-card__action--renew"
                onClick={handleRenew}
                disabled={isRenewingLocal}
              >
                {isRenewingLocal ? (
                  <span className="subscription-card__spinner"></span>
                ) : (
                  <MuiSvgIcon size={18}>lucide:refresh-cw</MuiSvgIcon>
                )}
                Renovar
              </button>
            )}

            {/* Acciones para estado Canceled */}
            {subscription.status === 'canceled' && (
              <button 
                className="subscription-card__action subscription-card__action--renew"
                onClick={handleRenew}
                disabled={isRenewingLocal}
              >
                {isRenewingLocal ? (
                  <span className="subscription-card__spinner"></span>
                ) : (
                  <MuiSvgIcon size={18}>lucide:refresh-cw</MuiSvgIcon>
                )}
                Reactivar
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Vista Grid
  return (
    <div className="subscription-card">
      <div className="subscription-card__header">
        <div className="subscription-card__company">
          <div className="subscription-card__company-avatar">
            <MuiSvgIcon size={28}>heroicons-outline:building-office</MuiSvgIcon>
          </div>
          <div>
            <h3 className="subscription-card__company-name">{subscription.company.name}</h3>
            <span className="subscription-card__company-ruc">RUC: {subscription.company.ruc}</span>
          </div>
        </div>
        <div 
          className="subscription-card__status-badge"
          style={{ backgroundColor: statusConfig?.bgColor, color: statusConfig?.color }}
          title={statusConfig?.description}
        >
          <MuiSvgIcon size={14}>{statusConfig?.icon}</MuiSvgIcon>
          {statusConfig?.label}
        </div>
      </div>

      <div className="subscription-card__plan">
        <div className="subscription-card__plan-info">
          <span className="subscription-card__plan-name">{subscription.plan.name}</span>
          <span className="subscription-card__plan-code">{subscription.plan.code}</span>
        </div>
        <div className="subscription-card__plan-price">
          S/ {subscription.plan.price}
          <span className="subscription-card__plan-cycle">/{subscription.plan.billing_cycle === 'monthly' ? 'mes' : subscription.plan.billing_cycle}</span>
        </div>
      </div>

      <div className="subscription-card__dates">
        <div className="subscription-card__date">
          <MuiSvgIcon size={16}>lucide:calendar</MuiSvgIcon>
          <span>Inicio: {formatDate(subscription.start_date)}</span>
        </div>
        <div className="subscription-card__date">
          <MuiSvgIcon size={16}>lucide:calendar</MuiSvgIcon>
          <span>Fin: {formatDate(subscription.end_date)}</span>
        </div>
        {subscription.trial_end && (
          <div className="subscription-card__date">
            <MuiSvgIcon size={16}>lucide:clock</MuiSvgIcon>
            <span>Trial: {formatDate(subscription.trial_end)}</span>
          </div>
        )}
      </div>

      {/* Mensajes según el estado */}
      {subscription.status === 'trial' && trialDaysRemaining !== null && (
        <div className={`subscription-card__days-remaining subscription-card__days-remaining--trial ${isTrialExpiringSoon ? 'subscription-card__days-remaining--warning' : ''}`}>
          <MuiSvgIcon size={16}>lucide:clock</MuiSvgIcon>
          <span>
            {isTrialExpiringSoon 
              ? `¡Prueba termina en ${trialDaysRemaining} días!` 
              : `${trialDaysRemaining} días de prueba`}
          </span>
        </div>
      )}

      {subscription.status === 'past_due' && (
        <div className="subscription-card__days-remaining subscription-card__days-remaining--past-due">
          <MuiSvgIcon size={16}>lucide:alert-triangle</MuiSvgIcon>
          <span>Pago pendiente</span>
        </div>
      )}

      {subscription.status === 'active' && daysRemaining !== null && (
        <div className={`subscription-card__days-remaining ${isExpiringSoon ? 'subscription-card__days-remaining--warning' : ''} ${isExpired ? 'subscription-card__days-remaining--expired' : ''}`}>
          <MuiSvgIcon size={16}>lucide:hourglass</MuiSvgIcon>
          <span>
            {isExpired ? 'Expirada' : `${daysRemaining} días restantes`}
          </span>
        </div>
      )}

      <div className="subscription-card__footer">
        {/* Acciones para estado Trial */}
        {subscription.status === 'trial' && (
          <>
            <button 
              className="subscription-card__btn subscription-card__btn--activate"
              onClick={handleActivate}
              disabled={isActivatingLocal}
            >
              {isActivatingLocal ? (
                <span className="subscription-card__spinner"></span>
              ) : (
                <>
                  <MuiSvgIcon size={18}>lucide:play-circle</MuiSvgIcon>
                  Activar
                </>
              )}
            </button>
            <button 
              className="subscription-card__btn subscription-card__btn--cancel"
              onClick={handleCancel}
              disabled={isCancelingLocal}
            >
              {isCancelingLocal ? (
                <span className="subscription-card__spinner"></span>
              ) : (
                <>
                  <MuiSvgIcon size={18}>lucide:x-circle</MuiSvgIcon>
                  Cancelar
                </>
              )}
            </button>
          </>
        )}

        {/* Acciones para estado Past Due */}
        {subscription.status === 'past_due' && (
          <>
            <button 
              className="subscription-card__btn subscription-card__btn--renew"
              onClick={handleRenew}
              disabled={isRenewingLocal}
            >
              {isRenewingLocal ? (
                <span className="subscription-card__spinner"></span>
              ) : (
                <>
                  <MuiSvgIcon size={18}>lucide:credit-card</MuiSvgIcon>
                  Pagar
                </>
              )}
            </button>
            <button 
              className="subscription-card__btn subscription-card__btn--cancel"
              onClick={handleCancel}
              disabled={isCancelingLocal}
            >
              {isCancelingLocal ? (
                <span className="subscription-card__spinner"></span>
              ) : (
                <>
                  <MuiSvgIcon size={18}>lucide:x-circle</MuiSvgIcon>
                  Cancelar
                </>
              )}
            </button>
          </>
        )}

        {/* Acciones para estado Active */}
        {subscription.status === 'active' && (
          <button 
            className="subscription-card__btn subscription-card__btn--cancel"
            onClick={handleCancel}
            disabled={isCancelingLocal}
          >
            {isCancelingLocal ? (
              <span className="subscription-card__spinner"></span>
            ) : (
              <>
                <MuiSvgIcon size={18}>lucide:x-circle</MuiSvgIcon>
                Cancelar
              </>
            )}
          </button>
        )}

        {(subscription.status === 'canceled' || (subscription.status === 'active' && isExpired)) && (
          <button 
            className="subscription-card__btn subscription-card__btn--renew"
            onClick={handleRenew}
            disabled={isRenewingLocal}
          >
            {isRenewingLocal ? (
              <span className="subscription-card__spinner"></span>
            ) : (
              <>
                <MuiSvgIcon size={18}>lucide:refresh-cw</MuiSvgIcon>
                Renovar
              </>
            )}
          </button>
        )}

        {/* Acciones para estado Canceled */}
        {subscription.status === 'canceled' && (
          <button 
            className="subscription-card__btn subscription-card__btn--renew"
            onClick={handleRenew}
            disabled={isRenewingLocal}
          >
            {isRenewingLocal ? (
              <span className="subscription-card__spinner"></span>
            ) : (
              <>
                <MuiSvgIcon size={18}>lucide:refresh-cw</MuiSvgIcon>
                Reactivar
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}