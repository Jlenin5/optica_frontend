import { AppModal } from '@/components/ui/modal'
import { useState, useEffect } from "react"
import { getAvailableLimitsForPlan } from "../api/limits.api"
import type { Limit } from "../types/limits.types"

interface AssignLimitModalProps {
  planId: number
  currentLimits: number[]
  onAssign: (data: { limit_id: number; value: number | null }) => void
  onClose: () => void
  isSubmitting: boolean
}

export const AssignLimitModal = ({
  planId,
  currentLimits,
  onAssign,
  onClose,
  isSubmitting
}: AssignLimitModalProps) => {
  const [availableLimits, setAvailableLimits] = useState<Limit[]>([])
  const [selectedLimitId, setSelectedLimitId] = useState<number | null>(null)
  const [limitValue, setLimitValue] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAvailableLimits = async () => {
      try {
        const limits = await getAvailableLimitsForPlan(planId)
        setAvailableLimits(limits)
      } catch (error) {
        console.error('Error fetching available limits:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAvailableLimits()
  }, [planId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedLimitId) {
      onAssign({
        limit_id: selectedLimitId,
        value: limitValue === "" ? null : parseInt(limitValue)
      })
    }
  }

  const selectedLimit = availableLimits.find(l => l.id === selectedLimitId)

  return (
    <AppModal title="Asignar Límite al Plan" onClose={onClose}>
        <form onSubmit={handleSubmit} className="assign-limit-modal__form">
          <div className="assign-limit-modal__field">
            <label htmlFor="limit_id">Límite *</label>
            <select
              id="limit_id"
              value={selectedLimitId || ""}
              onChange={(e) => setSelectedLimitId(parseInt(e.target.value))}
              disabled={isLoading}
              required
            >
              <option value="">Seleccione un límite</option>
              {availableLimits.map(limit => (
                <option key={limit.id} value={limit.id}>
                  {limit.name} ({limit.code})
                </option>
              ))}
            </select>
            {isLoading && (
              <div className="assign-limit-modal__loading">
                <span className="assign-limit-modal__spinner"></span>
                Cargando límites disponibles...
              </div>
            )}
          </div>

          {selectedLimit && (
            <div className="assign-limit-modal__field">
              <label htmlFor="value">Valor (opcional)</label>
              <input
                type="number"
                id="value"
                value={limitValue}
                onChange={(e) => setLimitValue(e.target.value)}
                placeholder="Dejar vacío para sin límite"
                min="0"
              />
              <p className="assign-limit-modal__helper">
                Define el valor máximo permitido para este límite. Dejar vacío para indicar que no hay límite.
              </p>
            </div>
          )}

          <div className="assign-limit-modal__actions">
            <button
              type="button"
              className="assign-limit-modal__cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="assign-limit-modal__submit"
              disabled={!selectedLimitId || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="assign-limit-modal__spinner"></span>
                  Asignando...
                </>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </form>
    </AppModal>
  )
}