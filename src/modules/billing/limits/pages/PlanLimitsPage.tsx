// modules/limits/pages/PlanLimitsPage.tsx
import { useState, useEffect } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { usePlanLimits } from "../hooks/usePlanLimits"
import { useAssignLimitToPlan } from "../hooks/useAssignLimitToPlan"
import { useUpdatePlanLimit } from "../hooks/useUpdatePlanLimit"
import { useRemovePlanLimit } from "../hooks/useRemovePlanLimit"
import { usePlans } from "@plans/hooks/usePlans"
import { PlanLimitsTable } from "../components/PlanLimitsTable"
import { AssignLimitModal } from "../components/AssignLimitModal"
import { PlanLimitsSkeleton } from "../components/PlanLimitsSkeleton"
import { LimitUsageModal } from "../components/LimitUsageModal"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/plan-limits.scss"

export const PlanLimitsPage = () => {
  const { planId } = useParams<{ planId: string }>()
  const [searchParams] = useSearchParams()
  const limitIdFromQuery = searchParams.get('limit_id')
  const limitNameFromQuery = searchParams.get('limit_name')
  const navigate = useNavigate()
  
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [editingValue, setEditingValue] = useState<{ id: number; value: number | null } | null>(null)
  const [showLimitUsageModal, setShowLimitUsageModal] = useState(false)
  const [selectedLimitId, setSelectedLimitId] = useState<number | null>(null)
  const [selectedLimitName, setSelectedLimitName] = useState<string>("")
  const [isViewingLimitUsage, setIsViewingLimitUsage] = useState(false)

  // Verificar si hay planId
  const planIdNumber = planId ? Number(planId) : null

  const { data: planLimits, isLoading, refetch } = usePlanLimits(planIdNumber || 0, {
    enabled: !!planIdNumber && !limitIdFromQuery
  })
  
  const { data: plansData, isLoading: plansLoading } = usePlans()
  const { mutate: assignLimit, isPending: isAssigning } = useAssignLimitToPlan()
  const { mutate: updateLimit, isPending: isUpdating } = useUpdatePlanLimit()
  const { mutate: removeLimit, isPending: isRemoving } = useRemovePlanLimit()

  // Obtener el plan actual
  const plan = plansData?.pages?.flatMap(page => page.results)?.find(p => p.id === planIdNumber)

  // Verificar si hay un limit_id en la URL para mostrar el modal de uso
  useEffect(() => {
    if (limitIdFromQuery) {
      setSelectedLimitId(Number(limitIdFromQuery))
      setSelectedLimitName(limitNameFromQuery ? decodeURIComponent(limitNameFromQuery) : '')
      setShowLimitUsageModal(true)
      setIsViewingLimitUsage(true)
    }
  }, [limitIdFromQuery, limitNameFromQuery])

  const handleAssign = (data: { limit_id: number; value: number | null }) => {
    if (!planIdNumber) return
    assignLimit({
      plan_id: planIdNumber,
      limit_id: data.limit_id,
      value: data.value
    }, {
      onSuccess: () => {
        setIsAssignModalOpen(false)
        refetch()
      }
    })
  }

  const handleUpdateValue = (id: number, value: number | null) => {
    updateLimit({ id, value }, {
      onSuccess: () => {
        setEditingValue(null)
        refetch()
      }
    })
  }

  const handleRemove = (id: number) => {
    if (confirm("¿Estás seguro de que deseas remover este límite del plan?")) {
      removeLimit(id, {
        onSuccess: () => refetch()
      })
    }
  }

  const handleViewLimitUsage = (limitId: number, limitName: string) => {
    setSelectedLimitId(limitId)
    setSelectedLimitName(limitName)
    setShowLimitUsageModal(true)
    setIsViewingLimitUsage(true)
  }

  const handleCloseLimitUsageModal = () => {
    setShowLimitUsageModal(false)
    setIsViewingLimitUsage(false)
    // Si estamos en modo de vista de límite y no hay planId, volver a límites
    if (!planIdNumber && limitIdFromQuery) {
      navigate('/billing/limits')
    }
  }

  // Si estamos viendo el uso de un límite específico (sin planId)
  if (isViewingLimitUsage && !planIdNumber && showLimitUsageModal) {
    return (
      <>
        <div className="plan-limits-page plan-limits-page--modal-only">
          <div className="plan-limits-page__header">
            <div className="plan-limits-page__header-left">
              <button 
                className="plan-limits-page__back-btn"
                onClick={() => navigate('/billing/limits')}
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Volver
              </button>
              <div>
                <h1 className="plan-limits-page__title">
                  Uso del Límite: {selectedLimitName}
                </h1>
                <p className="plan-limits-page__subtitle">
                  Planes que tienen configurado este límite
                </p>
              </div>
            </div>
          </div>
        </div>
        <LimitUsageModal
          limitId={selectedLimitId!}
          limitName={selectedLimitName}
          onClose={handleCloseLimitUsageModal}
        />
      </>
    )
  }

  // Mostrar skeleton mientras carga
  if (isLoading || plansLoading) {
    return <PlanLimitsSkeleton />
  }

  // Si no hay planId, mostrar error
  if (!planIdNumber) {
    return (
      <div className="plan-limits-error">
        <div className="plan-limits-error__content">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 8V12M12 16H12.01M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <h2>Plan no especificado</h2>
          <p>No se ha seleccionado ningún plan para configurar sus límites</p>
          <button onClick={() => navigate('/billing/plans')}>
            Volver a Planes
          </button>
        </div>
      </div>
    )
  }

  // Transformar los límites para la tabla
  const transformedLimits = planLimits?.map(limit => ({
    id: limit.id,
    limit_id: limit.limit_id,
    limit: {
      code: limit.code || limit.limit?.code || '',
      name: limit.name || limit.limit?.name || ''
    },
    value: limit.value
  })) || []

  return (
    <div className="plan-limits-page">
      {/* Header */}
      <div className="plan-limits-page__header">
        <div className="plan-limits-page__header-left">
          <button 
            className="plan-limits-page__back-btn"
            onClick={() => navigate('/billing/plans')}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <div>
            <h1 className="plan-limits-page__title">
              Límites del Plan: {plan?.name || `ID: ${planId}`}
            </h1>
          </div>
        </div>
        <button 
          className="add-button"
          onClick={() => setIsAssignModalOpen(true)}
        >
          <MuiSvgIcon size={18}>
            lucide:plus
          </MuiSvgIcon>
          Agregar
        </button>
      </div>

      {/* Plan Limits Table */}
      <div className="plan-limits-page__content">
        {transformedLimits.length > 0 ? (
          <PlanLimitsTable 
            limits={transformedLimits}
            onUpdateValue={handleUpdateValue}
            onRemove={handleRemove}
            onViewUsage={handleViewLimitUsage}
            editingValue={editingValue}
            setEditingValue={setEditingValue}
            isUpdating={isUpdating}
            isRemoving={isRemoving}
          />
        ) : (
          <div className="plan-limits-empty">
            <svg className="plan-limits-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <h3>No hay límites asignados</h3>
            <p>Este plan aún no tiene límites configurados</p>
            <button 
              className="plan-limits-empty__button"
              onClick={() => setIsAssignModalOpen(true)}
            >
              Asignar Límites
            </button>
          </div>
        )}
      </div>

      {/* Assign Limit Modal */}
      {isAssignModalOpen && (
        <AssignLimitModal
          planId={planIdNumber}
          currentLimits={transformedLimits.map(l => l.limit_id)}
          onAssign={handleAssign}
          onClose={() => setIsAssignModalOpen(false)}
          isSubmitting={isAssigning}
        />
      )}

      {/* Limit Usage Modal */}
      {showLimitUsageModal && selectedLimitId && (
        <LimitUsageModal
          limitId={selectedLimitId}
          limitName={selectedLimitName}
          onClose={handleCloseLimitUsageModal}
        />
      )}
    </div>
  )
}