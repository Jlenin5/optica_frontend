import { useState, useEffect } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { usePlanFeatures } from "../hooks/usePlanFeatures"
import { useAssignFeatureToPlan } from "../hooks/useAssignFeatureToPlan"
import { useRemoveFeatureFromPlan } from "../hooks/useRemoveFeatureFromPlan"
import { usePlans } from "@plans/hooks/usePlans"
import { PlanFeaturesTable } from "../components/PlanFeaturesTable"
import { AssignFeatureModal } from "../components/AssignFeatureModal"
import { PlanFeaturesSkeleton } from "../components/PlanFeaturesSkeleton"
import { FeatureUsageModal } from "../components/FeatureUsageModal"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/plan-features.scss"

export const PlanFeaturesPage = () => {
  const { planId } = useParams<{ planId: string }>()
  const [searchParams] = useSearchParams()
  const featureIdFromQuery = searchParams.get('feature_id')
  const featureNameFromQuery = searchParams.get('feature_name')
  const navigate = useNavigate()
  
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [showFeatureUsageModal, setShowFeatureUsageModal] = useState(false)
  const [selectedFeatureId, setSelectedFeatureId] = useState<number | null>(null)
  const [selectedFeatureName, setSelectedFeatureName] = useState<string>("")
  const [isViewingFeatureUsage, setIsViewingFeatureUsage] = useState(false)

  const planIdNumber = planId ? Number(planId) : null

  const { data: planFeatures, isLoading, refetch } = usePlanFeatures(planIdNumber || 0, {
    enabled: !!planIdNumber && !featureIdFromQuery
  })
  
  const { data: plansData, isLoading: plansLoading } = usePlans()
  const { mutate: assignFeature, isPending: isAssigning } = useAssignFeatureToPlan()
  const { mutate: removeFeature, isPending: isRemoving } = useRemoveFeatureFromPlan()

  const plan = plansData?.pages?.flatMap(page => page.results)?.find(p => p.id === planIdNumber)

  useEffect(() => {
    if (featureIdFromQuery) {
      setSelectedFeatureId(Number(featureIdFromQuery))
      setSelectedFeatureName(featureNameFromQuery ? decodeURIComponent(featureNameFromQuery) : '')
      setShowFeatureUsageModal(true)
      setIsViewingFeatureUsage(true)
    }
  }, [featureIdFromQuery, featureNameFromQuery])

  const handleAssign = (data: { feature_id: number }) => {
    if (!planIdNumber) return
    assignFeature({
      plan_id: planIdNumber,
      feature_id: data.feature_id
    }, {
      onSuccess: () => {
        setIsAssignModalOpen(false)
        refetch()
      }
    })
  }

  const handleRemove = (id: number) => {
    if (confirm("¿Estás seguro de que deseas remover esta característica del plan?")) {
      removeFeature(id, {
        onSuccess: () => refetch()
      })
    }
  }

  const handleViewFeatureUsage = (featureId: number, featureName: string) => {
    setSelectedFeatureId(featureId)
    setSelectedFeatureName(featureName)
    setShowFeatureUsageModal(true)
    setIsViewingFeatureUsage(true)
  }

  const handleCloseFeatureUsageModal = () => {
    setShowFeatureUsageModal(false)
    setIsViewingFeatureUsage(false)
    if (!planIdNumber && featureIdFromQuery) {
      navigate('/billing/features')
    }
  }

  if (isViewingFeatureUsage && !planIdNumber && showFeatureUsageModal) {
    return (
      <>
        <div className="plan-features-page plan-features-page--modal-only">
          <div className="plan-features-page__header">
            <div className="plan-features-page__header-left">
              <button 
                className="plan-features-page__back-btn"
                onClick={() => navigate('/billing/features')}
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Volver
              </button>
              <div>
                <h1 className="plan-features-page__title">
                  Uso de la Característica: {selectedFeatureName}
                </h1>
                <p className="plan-features-page__subtitle">
                  Planes que tienen esta característica habilitada
                </p>
              </div>
            </div>
          </div>
        </div>
        <FeatureUsageModal
          featureId={selectedFeatureId!}
          featureName={selectedFeatureName}
          onClose={handleCloseFeatureUsageModal}
        />
      </>
    )
  }

  if (isLoading || plansLoading) {
    return <PlanFeaturesSkeleton />
  }

  if (!planIdNumber) {
    return (
      <div className="plan-features-error">
        <div className="plan-features-error__content">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 8V12M12 16H12.01M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <h2>Plan no especificado</h2>
          <p>No se ha seleccionado ningún plan para configurar sus características</p>
          <button onClick={() => navigate('/billing/plans')}>
            Volver a Planes
          </button>
        </div>
      </div>
    )
  }

  const featuresList = planFeatures || []

  return (
    <div className="plan-features-page">
      <div className="plan-features-page__header">
        <div className="plan-features-page__header-left">
          <button 
            className="plan-features-page__back-btn"
            onClick={() => navigate('/billing/plans')}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <div>
            <h1 className="plan-features-page__title">
              Características del Plan: {plan?.name || `ID: ${planId}`}
            </h1>
          </div>
        </div>
        <button 
          className="plan-features-page__add-button"
          onClick={() => setIsAssignModalOpen(true)}
        >
          <MuiSvgIcon size={18}>
            lucide:plus
          </MuiSvgIcon>
          Agregar
        </button>
      </div>

      <div className="plan-features-page__content">
        {featuresList.length > 0 ? (
          <PlanFeaturesTable 
            features={featuresList}
            onRemove={handleRemove}
            onViewUsage={handleViewFeatureUsage}
            isRemoving={isRemoving}
          />
        ) : (
          <div className="plan-features-empty">
            <svg className="plan-features-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <h3>No hay características asignadas</h3>
            <p>Este plan aún no tiene características configuradas</p>
            <button 
              className="plan-features-empty__button"
              onClick={() => setIsAssignModalOpen(true)}
            >
              Asignar Características
            </button>
          </div>
        )}
      </div>

      {isAssignModalOpen && (
        <AssignFeatureModal
          planId={planIdNumber}
          currentFeatures={featuresList.map(f => f.feature_id)}
          onAssign={handleAssign}
          onClose={() => setIsAssignModalOpen(false)}
          isSubmitting={isAssigning}
        />
      )}

      {showFeatureUsageModal && selectedFeatureId && (
        <FeatureUsageModal
          featureId={selectedFeatureId}
          featureName={selectedFeatureName}
          onClose={handleCloseFeatureUsageModal}
        />
      )}
    </div>
  )
}