import { useNavigate, useParams } from "react-router-dom"
import { useCreatePrescription } from "../hooks/useCreatePrescription"
import { PrescriptionForm } from "../components/PrescriptionForm"
import { usePatient } from "@/modules/clinical/patients/hooks/usePatient"
import { PatientSkeleton } from "@/modules/clinical/patients/components/PatientSkeleton"
import MuiSvgIcon from "@/components/MuiSvgIcon"
import type { CreatePrescriptionDTO } from "../types/prescriptions.types"
import "@styles/prescriptions.scss"

// Receta externa: pertenece directamente al paciente y NO a una consulta interna.
// Esto es diferente del MedicalRecord, que es el historial clínico del paciente.
export const CreateExternalPrescriptionPage = () => {
  const { patientId } = useParams<{ patientId: string }>()
  const navigate = useNavigate()
  const numericPatientId = Number(patientId)
  const { data: patient, isLoading } = usePatient(numericPatientId)
  const { mutate: createPrescription, isPending } = useCreatePrescription()

  const handleSubmit = (data: CreatePrescriptionDTO) => {
    createPrescription(
      { ...data, patient_id: numericPatientId, consultation_id: null, source_type: "EXTERNAL" },
      { onSuccess: () => navigate(`/patients/${numericPatientId}/prescriptions`) },
    )
  }

  if (isLoading) return <PatientSkeleton />

  if (!patient) {
    return (
      <div className="prescription-error">
        <div className="prescription-error__content">
          <MuiSvgIcon size={48}>lucide:alert-circle</MuiSvgIcon>
          <h2>Paciente no encontrado</h2>
          <button onClick={() => navigate("/patients")}>Volver a Pacientes</button>
        </div>
      </div>
    )
  }

  return (
    <div className="prescription-page">
      <div className="prescription-page__header">
        <button className="prescription-page__back-btn" onClick={() => navigate(`/patients/${numericPatientId}/prescriptions`)}>
          <svg viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <div>
          <h1 className="prescription-page__title">Nueva Receta Externa</h1>
          <p className="prescription-page__subtitle">Paciente: {patient.first_name} {patient.last_name}</p>
          <p className="prescription-page__subtitle">Esta receta proviene de una prescripción externa y no se vincula a una consulta interna.</p>
        </div>
      </div>
      <div className="prescription-page__content">
        <PrescriptionForm
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/patients/${numericPatientId}/prescriptions`)}
          isSubmitting={isPending}
          patientId={numericPatientId}
          fixedSourceType="EXTERNAL"
        />
      </div>
    </div>
  )
}
