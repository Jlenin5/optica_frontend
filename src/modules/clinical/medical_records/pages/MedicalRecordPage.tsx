import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useMedicalRecordByPatient } from "../hooks/useMedicalRecordByPatient"
import { useCreateMedicalRecord } from "../hooks/useCreateMedicalRecord"
import { useUpdateMedicalRecord } from "../hooks/useUpdateMedicalRecord"
import { usePatient } from "@/modules/clinical/patients/hooks/usePatient"
import { usePatientConsultations } from "@/modules/clinical/consultations/hooks/usePatientConsultations"
import { ConsultationList } from "@/modules/clinical/consultations/components/ConsultationList"
import { MedicalRecordDetail } from "../components/MedicalRecordDetail"
import { MedicalRecordForm } from "../components/MedicalRecordForm"
import { MedicalRecordSkeleton } from "../components/MedicalRecordSkeleton"
import MuiSvgIcon from "@/components/MuiSvgIcon"
import "@styles/clinical-evaluations.scss"
import "@styles/medical-records.scss"

// Patient 1:1 MedicalRecord: si el paciente aún no tiene historial clínico,
// se ofrece crearlo; una vez creado se listan sus consultas (MedicalRecord 1:N Consultation).
export const MedicalRecordPage = () => {
  const { patientId } = useParams<{ patientId: string }>()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)

  const { data: patient } = usePatient(Number(patientId))
  const { data: medicalRecord, isLoading } = useMedicalRecordByPatient(Number(patientId))
  const { mutate: createMedicalRecord, isPending: isCreating } = useCreateMedicalRecord()
  const { mutate: updateMedicalRecord, isPending: isUpdating } = useUpdateMedicalRecord()
  const { data: consultationsData } = usePatientConsultations(Number(patientId), {
    enabled: !!medicalRecord
  })

  const consultations = consultationsData?.pages?.flatMap((page: any) => page.results) || []

  const handleCreate = (data: any) => {
    createMedicalRecord(
      { ...data, patient_id: Number(patientId) },
      { onSuccess: () => setIsEditing(false) }
    )
  }

  const handleUpdate = (data: any) => {
    if (!medicalRecord) return
    updateMedicalRecord(
      { id: medicalRecord.id, data },
      { onSuccess: () => setIsEditing(false) }
    )
  }

  if (isLoading) {
    return <MedicalRecordSkeleton />
  }

  return (
    <div className="evaluation-page">
      <div className="evaluation-page__header">
        <button
          className="evaluation-page__back-btn"
          onClick={() => navigate(`/patients/${patientId}`)}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div>
          <h1 className="evaluation-page__title">Historial Clínico</h1>
          {patient && (
            <p className="evaluation-page__subtitle">
              Paciente: {patient.first_name} {patient.last_name}
            </p>
          )}
        </div>
      </div>

      <div className="evaluation-page__content">
        {!medicalRecord && !isEditing && (
          <div className="medical-record-empty">
            <MuiSvgIcon size={32}>lucide:heart-pulse</MuiSvgIcon>
            <p>Este paciente aún no tiene un historial clínico registrado.</p>
            <button
              className="medical-record-empty__btn"
              onClick={() => setIsEditing(true)}
            >
              Crear Historial Clínico
            </button>
          </div>
        )}

        {isEditing && (
          <MedicalRecordForm
            initialData={medicalRecord}
            onSubmit={medicalRecord ? handleUpdate : handleCreate}
            onCancel={() => setIsEditing(false)}
            isSubmitting={isCreating || isUpdating}
          />
        )}

        {medicalRecord && !isEditing && (
          <>
            <MedicalRecordDetail
              medicalRecord={medicalRecord}
              onEdit={() => setIsEditing(true)}
            />

            <div className="evaluation-detail-page__content" style={{ marginTop: 24, padding: '1.5rem' }}>
              <h2 className="medical-record-detail__title">
                <MuiSvgIcon size={20}>lucide:stethoscope</MuiSvgIcon>
                Consultas
              </h2>
              <ConsultationList evaluations={consultations} isLoading={false} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
