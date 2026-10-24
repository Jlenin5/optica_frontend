import { AppModal } from '@/components/ui/modal'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getPlansWithFeature } from "../api/features.api"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface FeatureUsageModalProps {
  featureId: number
  featureName: string
  onClose: () => void
}

interface PlanWithFeature {
  plan_id: number
  plan_name: string
  code: string
}

export const FeatureUsageModal = ({ featureId, featureName, onClose }: FeatureUsageModalProps) => {
  const navigate = useNavigate()
  const [plans, setPlans] = useState<PlanWithFeature[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPlansWithFeature = async () => {
      try {
        const response = await getPlansWithFeature(featureId)
        setPlans(response)
      } catch (error) {
        console.error('Error fetching plans with feature:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPlansWithFeature()
  }, [featureId])

  const handleViewPlanFeatures = (planId: number) => {
    onClose()
    navigate(`/billing/plan-features/${planId}`)
  }

  return (
    <AppModal title={`Planes con la característica: ${featureName}`} onClose={onClose}>
        <div className="feature-usage-modal__content">
          {isLoading ? (
            <div className="feature-usage-modal__loading">
              <span className="feature-usage-modal__spinner"></span>
              Cargando planes...
            </div>
          ) : plans.length > 0 ? (
            <div className="feature-usage-modal__list">
              {plans.map((plan) => (
                <div 
                  key={plan.plan_id} 
                  className="feature-usage-modal__item"
                  onClick={() => handleViewPlanFeatures(plan.plan_id)}
                >
                  <div className="feature-usage-modal__item-info">
                    <div className="feature-usage-modal__item-icon">
                      <MuiSvgIcon size={20}>lucide:package</MuiSvgIcon>
                    </div>
                    <div>
                      <div className="feature-usage-modal__item-name">{plan.plan_name}</div>
                      <div className="feature-usage-modal__item-code">{plan.code}</div>
                    </div>
                  </div>
                  <div className="feature-usage-modal__item-value">
                    <MuiSvgIcon size={16} className="feature-usage-modal__arrow">
                      lucide:chevron-right
                    </MuiSvgIcon>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="feature-usage-modal__empty">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <p>Esta característica no está siendo utilizada por ningún plan</p>
            </div>
          )}
        </div>
    </AppModal>
  )
}