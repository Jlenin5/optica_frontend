import { useState } from "react"
import { AppModal } from "@/components/ui/modal"
import { usePatientConsultations } from "@/modules/clinical/consultations/hooks/usePatientConsultations"
import { useLinkConsultationToAppointment } from "../hooks/useLinkConsultationToAppointment"
import type { Consultation } from "@/modules/clinical/consultations/types/consultations.types"

interface AppointmentConsultationModalProps {
  appointmentId: number
  patientId: number
  currentConsultationId?: number | null
  onClose: () => void
  onSuccess: () => void
}

// Permite asociar una Consulta (Consultation) existente del paciente a la cita.
// La prescripción no se elige aquí directamente: cada Consultation tiene a lo
// sumo una Prescription (relación 1:1), así que al vincular la consulta se
// obtiene también su prescripción, si existe.
export const AppointmentConsultationModal = ({
  appointmentId,
  patientId,
  currentConsultationId,
  onClose,
  onSuccess
}: AppointmentConsultationModalProps) => {
  const { data: consultationsData, isLoading } = usePatientConsultations(patientId)
  const consultations = consultationsData?.pages?.flatMap((page: any) => page.results) || []
  const { mutate: linkConsultation, isPending } = useLinkConsultationToAppointment()
  const [selectedConsultationId, setSelectedConsultationId] = useState<number | null>(currentConsultationId || null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedConsultationId) {
      linkConsultation(
        { appointmentId, consultationId: selectedConsultationId },
        {
          onSuccess: () => {
            onSuccess()
            onClose()
          }
        }
      )
    }
  }

  const handleUnlink = () => {
    if (confirm("¿Estás seguro de que deseas desasociar esta consulta?")) {
      onSuccess()
      onClose()
    }
  }

  return (
    <AppModal title="Asociar Consulta Clínica" onClose={onClose} size="sm">
        <form onSubmit={handleSubmit} className="prescription-modal__form">
          <div className="prescription-modal__field">
            <label>Seleccionar Consulta</label>
            {isLoading ? (
              <div className="prescription-modal__loading">
                <div className="prescription-modal__spinner"></div>
                <span>Cargando consultas...</span>
              </div>
            ) : (
              <select
                value={selectedConsultationId || ""}
                onChange={(e) => setSelectedConsultationId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">Seleccionar consulta</option>
                {consultations?.map((consultation: Consultation) => (
                  <option key={consultation.id} value={consultation.id}>
                    {formatDate(consultation.created_at)} - {consultation.chief_complaint}
                    {consultation.prescription ? " (con prescripción)" : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="prescription-modal__actions">
            {currentConsultationId && (
              <button
                type="button"
                className="prescription-modal__btn prescription-modal__btn--danger"
                onClick={handleUnlink}
              >
                Desasociar
              </button>
            )}
            <button
              type="button"
              className="prescription-modal__btn prescription-modal__btn--secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="prescription-modal__btn prescription-modal__btn--primary"
              disabled={!selectedConsultationId || isPending}
            >
              {isPending ? "Asociando..." : "Asociar Consulta"}
            </button>
          </div>
        </form>
    </AppModal>
  )
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-PE')
}
