import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useCreatePrescription } from "../hooks/useCreatePrescription"
import { useUpdatePrescription } from "../hooks/useUpdatePrescription"
import { useConsultation } from "@/modules/clinical/consultations/hooks/useConsultation"
import { PrescriptionForm } from "../components/PrescriptionForm"
import { PrescriptionView } from "../components/PrescriptionView"
import { PrescriptionSkeleton } from "../components/PrescriptionSkeleton"
import "@styles/prescriptions.scss"

// Prescription 1:1 Consultation: esta página crea la prescripción de una
// consulta que aún no la tiene, o la muestra/edita si ya existe.
export const CreatePrescriptionPage = () => {
  const { consultationId } = useParams<{ consultationId: string }>()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)

  const { mutate: createPrescription, isPending: isCreating } = useCreatePrescription()
  const { mutate: updatePrescription, isPending: isUpdating } = useUpdatePrescription()
  const { data: consultation, isLoading } = useConsultation(Number(consultationId))

  const patient = consultation?.medical_record?.patient
  const existingPrescription = consultation?.prescription || null

  const handleSubmit = (prescriptionData: any) => {
    if (existingPrescription) {
      updatePrescription(
        { id: existingPrescription.id, data: prescriptionData },
        { onSuccess: () => setIsEditing(false) }
      )
    } else {
      createPrescription(
        { ...prescriptionData, consultation_id: Number(consultationId) },
        { onSuccess: () => navigate(`/consultations/${consultationId}`) }
      )
    }
  }

  if (isLoading) {
    return <PrescriptionSkeleton />
  }

  if (!consultation) {
    return (
      <div className="prescription-error">
        <div className="prescription-error__content">
          <h2>Consulta no encontrada</h2>
          <button onClick={() => navigate('/appointments')}>
            Volver a Citas
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="prescription-page">
      <div className="prescription-page__header">
        <button
          className="prescription-page__back-btn"
          onClick={() => navigate(`/consultations/${consultationId}`)}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div>
          <h1 className="prescription-page__title">
            {existingPrescription ? 'Prescripción' : 'Nueva Prescripción'}
          </h1>
          <p className="prescription-page__subtitle">
            Paciente: {patient?.first_name || consultation.patient_name} {patient?.last_name || ""}
          </p>
          {(patient?.document_number || consultation.patient_document) && (
            <p className="prescription-page__subtitle">
              Documento: {patient?.document_number || consultation.patient_document}
            </p>
          )}
        </div>
      </div>

      <div className="prescription-page__content">
        {!isEditing && existingPrescription ? (
          <PrescriptionView
            prescription={existingPrescription}
            onEdit={() => setIsEditing(true)}
          />
        ) : (
          <PrescriptionForm
            initialData={existingPrescription}
            onSubmit={handleSubmit}
            onCancel={() => {
              if (existingPrescription) {
                setIsEditing(false)
              } else {
                navigate(`/consultations/${consultationId}`)
              }
            }}
            isSubmitting={isCreating || isUpdating}
            consultationId={Number(consultationId)}
            patientId={patient?.id}
            fixedSourceType="INTERNAL"
          />
        )}
      </div>
    </div>
  )
}
