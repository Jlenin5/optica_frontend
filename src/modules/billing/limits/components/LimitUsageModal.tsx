import { AppModal } from '@/components/ui/modal'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getPlansWithLimit } from "../api/limits.api"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface LimitUsageModalProps {
  limitId: number
  limitName: string
  onClose: () => void
}

interface PlanWithLimitValue {
  plan_id: number
  plan_name: string
  value: number
  code?: string
  limit_id: number
}

export const LimitUsageModal = ({ limitId, limitName, onClose }: LimitUsageModalProps) => {
  const navigate = useNavigate()
  const [plans, setPlans] = useState<PlanWithLimitValue[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPlansWithLimit = async () => {
      try {
        const response = await getPlansWithLimit(limitId)
        setPlans(response)
      } catch (error) {
        console.error('Error fetching plans with limit:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPlansWithLimit()
  }, [limitId])

  const formatValue = (value: number | null) => {
    if (value === null) return 'Sin límite'
    return value?.toLocaleString()
  }

  const handleViewPlanLimits = (planId: number) => {
    onClose()
    navigate(`/billing/plan-limits/${planId}`)
  }

  return (
    <AppModal title={`Planes que usan: ${limitName}`} onClose={onClose}>
        <div className="limit-usage-modal__content">
          {isLoading ? (
            <div className="limit-usage-modal__loading">
              <span className="limit-usage-modal__spinner"></span>
              Cargando planes...
            </div>
          ) : plans.length > 0 ? (
            <div className="limit-usage-modal__list">
              {plans?.map((plan) => (
                <div
                  key={plan.plan_id} 
                  className="limit-usage-modal__item"
                  onClick={() => handleViewPlanLimits(plan.plan_id)}
                >
                  <div className="limit-usage-modal__item-info">
                    <div className="limit-usage-modal__item-icon">
                      <MuiSvgIcon size={20}>lucide:package</MuiSvgIcon>
                    </div>
                    <div>
                      <div className="limit-usage-modal__item-name">{plan.plan_name}</div>
                      <div className="limit-usage-modal__item-code">{plan.code}</div>
                    </div>
                  </div>
                  <div className="limit-usage-modal__item-value">
                    <span className={`limit-usage-modal__value-badge ${!plan.value ? 'limit-usage-modal__value-badge--empty' : ''}`}>
                      {formatValue(plan.value)}
                    </span>
                    <MuiSvgIcon size={16} className="limit-usage-modal__arrow">
                      lucide:chevron-right
                    </MuiSvgIcon>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="limit-usage-modal__empty">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <p>Este límite no está siendo utilizado por ningún plan</p>
            </div>
          )}
        </div>
    </AppModal>
  )
}