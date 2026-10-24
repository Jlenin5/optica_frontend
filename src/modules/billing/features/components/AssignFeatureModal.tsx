import { AppModal } from '@/components/ui/modal'
import { useState, useEffect } from "react"
import { getAvailableFeaturesForPlan } from "../api/features.api"
import type { Feature } from "../types/features.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface AssignFeatureModalProps {
  planId: number
  currentFeatures: number[]
  onAssign: (data: { feature_id: number }) => void
  onClose: () => void
  isSubmitting: boolean
}

export const AssignFeatureModal = ({
  planId,
  currentFeatures,
  onAssign,
  onClose,
  isSubmitting
}: AssignFeatureModalProps) => {
  const [availableFeatures, setAvailableFeatures] = useState<Feature[]>([])
  const [selectedFeatureId, setSelectedFeatureId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAvailableFeatures = async () => {
      try {
        const features = await getAvailableFeaturesForPlan(planId)
        setAvailableFeatures(features)
      } catch (error) {
        console.error('Error fetching available features:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAvailableFeatures()
  }, [planId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedFeatureId) {
      onAssign({ feature_id: selectedFeatureId })
    }
  }

  const getFeatureIcon = (code: string) => {
    const icons: Record<string, string> = {
      sales_module: 'lucide:shopping-cart',
      inventory_module: 'lucide:package',
      clinical_module: 'lucide:heart',
      laboratory_module: 'lucide:flask',
      reports_module: 'lucide:bar-chart',
      multi_store: 'lucide:building-2',
      electronic_invoicing: 'lucide:file-text',
      cash_module: 'lucide:credit-card'
    }
    return icons[code] || 'lucide:settings'
  }

  return (
    <AppModal title="Asignar Característica al Plan" onClose={onClose}>
        <form onSubmit={handleSubmit} className="assign-feature-modal__form">
          <div className="assign-feature-modal__field">
            <label htmlFor="feature_id">Característica *</label>
            <select
              id="feature_id"
              value={selectedFeatureId || ""}
              onChange={(e) => setSelectedFeatureId(parseInt(e.target.value))}
              disabled={isLoading}
              required
            >
              <option value="">Seleccione una característica</option>
              {availableFeatures.map(feature => (
                <option key={feature.id} value={feature.id}>
                  {feature.name} ({feature.code})
                </option>
              ))}
            </select>
            {isLoading && (
              <div className="assign-feature-modal__loading">
                <span className="assign-feature-modal__spinner"></span>
                Cargando características disponibles...
              </div>
            )}
          </div>

          {selectedFeatureId && (
            <div className="assign-feature-modal__preview">
              <div className="assign-feature-modal__preview-icon">
                <MuiSvgIcon size={24}>
                  {getFeatureIcon(availableFeatures.find(f => f.id === selectedFeatureId)?.code || '')}
                </MuiSvgIcon>
              </div>
              <div className="assign-feature-modal__preview-info">
                <h4>{availableFeatures.find(f => f.id === selectedFeatureId)?.name}</h4>
                <p>{availableFeatures.find(f => f.id === selectedFeatureId)?.description}</p>
              </div>
            </div>
          )}

          <div className="assign-feature-modal__actions">
            <button
              type="button"
              className="assign-feature-modal__cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="assign-feature-modal__submit"
              disabled={!selectedFeatureId || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="assign-feature-modal__spinner"></span>
                  Asignando...
                </>
              ) : (
                'Asignar Característica'
              )}
            </button>
          </div>
        </form>
    </AppModal>
  )
}