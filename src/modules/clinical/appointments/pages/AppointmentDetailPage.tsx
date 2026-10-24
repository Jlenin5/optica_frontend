import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAppointment } from "../hooks/useAppointment"
import { useConsultations } from "@/modules/clinical/consultations/hooks/useConsultations"
import { useCreateConsultation } from "@/modules/clinical/consultations/hooks/useCreateConsultation"
import { useUpdateConsultation } from "@/modules/clinical/consultations/hooks/useUpdateConsultation"
import { useCreatePrescription } from "@/modules/clinical/prescriptions/hooks/useCreatePrescription"
import { useMedicalRecordByPatient } from "@/modules/clinical/medical_records/hooks/useMedicalRecordByPatient"
import { useCreateMedicalRecord } from "@/modules/clinical/medical_records/hooks/useCreateMedicalRecord"
import { ConsultationForm } from "@/modules/clinical/consultations/components/ConsultationForm"
import { PrescriptionForm } from "@/modules/clinical/prescriptions/components/PrescriptionForm"
// import { AppointmentDetailSkeleton } from "../components/AppointmentDetailSkeleton"
import { useAuthStore } from "@/app/store/auth.store"
import MuiSvgIcon from "@/components/MuiSvgIcon"
import type { Consultation, ConsultationFormData } from "@/modules/clinical/consultations/types/consultations.types"
import "@styles/appointment-detail.scss"
import type { CreatePrescriptionDTO } from "../../prescriptions/types/prescriptions.types"

// Cadena clínica: Patient 1:1 MedicalRecord 1:N Consultation 1:1 Prescription.
// Esta página administra, para una cita puntual, la Consultation asociada
// (si existe) y su Prescription (si la consulta ya la tiene).
export const AppointmentDetailPage = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const { data: appointment, error } = useAppointment(Number(appointmentId))
  const patientId = appointment?.patient?.id || appointment?.patient_id

  // El paciente debe tener un historial clínico antes de registrar una consulta.
  const { data: medicalRecord } = useMedicalRecordByPatient(Number(patientId), {
    enabled: !!patientId
  })
  const { mutate: createMedicalRecord } = useCreateMedicalRecord()

  const { data: evaluationsData } = useConsultations({
    appointment_id: Number(appointmentId)
  })

  const { mutate: createEvaluation, isPending: isCreatingEvaluation } = useCreateConsultation()
  const { mutate: updateEvaluation, isPending: isUpdatingEvaluation } = useUpdateConsultation()
  const { mutate: createPrescription, isPending: isCreatingPrescription } = useCreatePrescription()

  const [showEvaluationForm, setShowEvaluationForm] = useState(false)
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false)
  const [editingEvaluation, setEditingEvaluation] = useState<Consultation | null>(null)

  const evaluation = evaluationsData?.pages[0]?.results[0] || null

  const handleCreateEvaluation = (data: ConsultationFormData) => {
    const submit = (medicalRecordId: number) => {
      createEvaluation({ ...data, medical_record_id: medicalRecordId }, {
        onSuccess: () => {
          setShowEvaluationForm(false)
        }
      })
    }

    if (medicalRecord) {
      submit(medicalRecord.id)
    } else if (patientId) {
      // Se crea automáticamente el historial clínico si el paciente aún no tiene uno (Patient 1:1 MedicalRecord).
      createMedicalRecord({ patient_id: Number(patientId) }, {
        onSuccess: (record) => submit(record.id)
      })
    }
  }

  const handleUpdateEvaluation = (data: ConsultationFormData) => {
    if (editingEvaluation) {
      updateEvaluation(
        { id: editingEvaluation.id, data },
        {
          onSuccess: () => {
            setEditingEvaluation(null)
            setShowEvaluationForm(false)
          }
        }
      )
    }
  }

  const handleCreatePrescription = (data: CreatePrescriptionDTO) => {
    if (!evaluation || evaluation.status !== "completed") return
    createPrescription({ ...data, patient_id: Number(patientId), consultation_id: evaluation.id }, {
      onSuccess: () => {
        setShowPrescriptionForm(false)
      }
    })
  }

  // if (isLoading) return <AppointmentDetailSkeleton />

  if (error || !appointment) {
    return (
      <div className="appointment-detail-error">
        <div className="appointment-detail-error__content">
          <MuiSvgIcon size={48}>lucide:alert-circle</MuiSvgIcon>
          <h2>Cita no encontrada</h2>
          <p>La cita que buscas no existe o no tienes permisos para verla.</p>
          <button onClick={() => navigate("/appointments/calendar")}>
            Volver al Calendario
          </button>
        </div>
      </div>
    )
  }

  const isOptometra = user?.role?.name === "optometra"
  const canModify = isOptometra ||
                    user?.is_superuser ||
                    ((user?.role?.name || '').toLowerCase() === 'administrador')

  return (
    <div className="appointment-detail">
      {/* Header */}
      <div className="appointment-detail__header">
        <button
          className="appointment-detail__back-btn"
          onClick={() => navigate("/appointments/calendar")}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div>
          <h1 className="appointment-detail__title">Detalle de la Cita</h1>
          <p className="appointment-detail__subtitle">
            {appointment.date} - {appointment.time}
          </p>
        </div>
        <span className={`appointment-detail__status appointment-detail__status--${appointment.status.toLowerCase()}`}>
          {appointment.status}
        </span>
        {appointment.status.toLowerCase() === "completed" && (
          <button
            className="appointment-detail__action-btn appointment-detail__action-btn--sale"
            onClick={() => navigate(`/sales/create?patient_id=${patientId}&appointment_id=${appointment.id}`)}
          >
            <MuiSvgIcon size={16}>lucide:shopping-cart</MuiSvgIcon>
            Registrar Venta
          </button>
        )}
      </div>

      <div className="appointment-detail__content">
        {/* Información del Paciente */}
        <div className="appointment-detail__card">
          <h2 className="appointment-detail__card-title">
            <MuiSvgIcon size={20}>lucide:user</MuiSvgIcon>
            Información del Paciente
          </h2>
          <div className="appointment-detail__card-body">
            <div className="appointment-detail__info-row">
              <span className="appointment-detail__info-label">Nombre:</span>
              <span className="appointment-detail__info-value">
                {appointment.patient?.first_name} {appointment.patient?.last_name}
              </span>
            </div>
            <div className="appointment-detail__info-row">
              <span className="appointment-detail__info-label">Documento:</span>
              <span className="appointment-detail__info-value">
                {appointment.patient?.document_number}
              </span>
            </div>
            {appointment.patient?.phone && (
              <div className="appointment-detail__info-row">
                <span className="appointment-detail__info-label">Teléfono:</span>
                <span className="appointment-detail__info-value">
                  {appointment.patient?.phone}
                </span>
              </div>
            )}
            {patientId && (
              <div className="appointment-detail__info-row">
                <button
                  className="appointment-detail__action-btn"
                  onClick={() => navigate(`/patients/${patientId}/medical-record`)}
                >
                  <MuiSvgIcon size={16}>lucide:heart-pulse</MuiSvgIcon>
                  Ver Historial Clínico
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Información de la Cita */}
        <div className="appointment-detail__card">
          <h2 className="appointment-detail__card-title">
            <MuiSvgIcon size={20}>lucide:calendar</MuiSvgIcon>
            Detalles de la Cita
          </h2>
          <div className="appointment-detail__card-body">
            <div className="appointment-detail__info-row">
              <span className="appointment-detail__info-label">Optometrista:</span>
              <span className="appointment-detail__info-value">
                {appointment.optometrist?.username || "No asignado"}
              </span>
            </div>
            <div className="appointment-detail__info-row">
              <span className="appointment-detail__info-label">Fecha:</span>
              <span className="appointment-detail__info-value">{appointment.date}</span>
            </div>
            <div className="appointment-detail__info-row">
              <span className="appointment-detail__info-label">Hora:</span>
              <span className="appointment-detail__info-value">{appointment.time}</span>
            </div>
            {appointment.notes && (
              <div className="appointment-detail__info-row appointment-detail__info-row--block">
                <span className="appointment-detail__info-label">Notas:</span>
                <span className="appointment-detail__info-value">{appointment.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Consulta Clínica */}
        <div className="appointment-detail__card">
          <div className="appointment-detail__card-header">
            <h2 className="appointment-detail__card-title">
              <MuiSvgIcon size={20}>lucide:stethoscope</MuiSvgIcon>
              Consulta Clínica
            </h2>
            {canModify && !evaluation && !showEvaluationForm && (
              <button
                className="appointment-detail__action-btn"
                onClick={() => {
                  setEditingEvaluation(null)
                  setShowEvaluationForm(true)
                }}
              >
                <MuiSvgIcon size={16}>lucide:plus</MuiSvgIcon>
                Nueva Consulta
              </button>
            )}
          </div>

          <div className="appointment-detail__card-body">
            {showEvaluationForm ? (
              <ConsultationForm
                initialData={editingEvaluation}
                onSubmit={editingEvaluation ? handleUpdateEvaluation : handleCreateEvaluation}
                onCancel={() => {
                  setShowEvaluationForm(false)
                  setEditingEvaluation(null)
                }}
                isSubmitting={isCreatingEvaluation || isUpdatingEvaluation}
                appointmentId={Number(appointmentId)}
                medicalRecordId={medicalRecord?.id || 0}
                optometristId={appointment.optometrist_id || user?.id}
              />
            ) : evaluation ? (
              <div className="evaluation-detail">
                <div className="evaluation-detail__info">
                  <div className="evaluation-detail__row">
                    <span className="evaluation-detail__label">Motivo de Consulta:</span>
                    <span className="evaluation-detail__value">{evaluation.chief_complaint}</span>
                  </div>
                  {evaluation.diagnosis && (
                    <div className="evaluation-detail__row">
                      <span className="evaluation-detail__label">Diagnóstico:</span>
                      <span className="evaluation-detail__value">{evaluation.diagnosis}</span>
                    </div>
                  )}
                  {(evaluation.visual_acuity_od || evaluation.visual_acuity_oi) && (
                    <div className="evaluation-detail__row">
                      <span className="evaluation-detail__label">Agudeza Visual:</span>
                      <span className="evaluation-detail__value">
                        OD: {evaluation.visual_acuity_od || "N/A"} | OI: {evaluation.visual_acuity_oi || "N/A"}
                      </span>
                    </div>
                  )}
                  {(evaluation.intraocular_pressure_od || evaluation.intraocular_pressure_oi) && (
                    <div className="evaluation-detail__row">
                      <span className="evaluation-detail__label">Presión Intraocular:</span>
                      <span className="evaluation-detail__value">
                        OD: {evaluation.intraocular_pressure_od || "N/A"} | OI: {evaluation.intraocular_pressure_oi || "N/A"}
                      </span>
                    </div>
                  )}
                  {evaluation.observations && (
                    <div className="evaluation-detail__row">
                      <span className="evaluation-detail__label">Observaciones:</span>
                      <span className="evaluation-detail__value">{evaluation.observations}</span>
                    </div>
                  )}
                  {evaluation.recommendations && (
                    <div className="evaluation-detail__row">
                      <span className="evaluation-detail__label">Recomendaciones:</span>
                      <span className="evaluation-detail__value">{evaluation.recommendations}</span>
                    </div>
                  )}
                </div>
                {canModify && (
                  <button
                    className="appointment-detail__edit-btn"
                    onClick={() => {
                      setEditingEvaluation(evaluation)
                      setShowEvaluationForm(true)
                    }}
                  >
                    <MuiSvgIcon size={16}>
                      heroicons-outline:pencil-square
                    </MuiSvgIcon>
                    Editar Consulta
                  </button>
                )}
              </div>
            ) : (
              <div className="appointment-detail__empty">
                <MuiSvgIcon size={32}>lucide:clipboard-list</MuiSvgIcon>
                <p>No se ha realizado una consulta clínica para esta cita.</p>
              </div>
            )}
          </div>
        </div>

        {/* Prescripción (Consultation 1:1 Prescription) */}
        {evaluation && (
          <div className="appointment-detail__card">
            <div className="appointment-detail__card-header">
              <h2 className="appointment-detail__card-title">
                <MuiSvgIcon size={20}>lucide:file-text</MuiSvgIcon>
                Prescripción
              </h2>
              {
                canModify
                && evaluation.status === "completed"
                && !evaluation.prescription
                && !showPrescriptionForm && (
                <button
                  className="appointment-detail__action-btn"
                  onClick={() => setShowPrescriptionForm(true)}
                >
                  <MuiSvgIcon size={16}>lucide:plus</MuiSvgIcon>
                  Nueva Prescripción
                </button>
              )}
            </div>

            <div className="appointment-detail__card-body">
              {showPrescriptionForm ? (
                <PrescriptionForm
                  onSubmit={handleCreatePrescription}
                  onCancel={() => setShowPrescriptionForm(false)}
                  isSubmitting={isCreatingPrescription}
                  consultationId={evaluation.id}
                  patientId={Number(patientId)}
                  fixedSourceType="INTERNAL"
                />
              ) : evaluation.prescription ? (
                <div className="prescription-detail">
                  <div className="prescription-detail__comparison">
                    <div className="prescription-detail__eye">
                      <h4>Ojo Derecho (OD)</h4>
                      <div className="prescription-detail__values">
                        <span>Esfera: {evaluation.prescription.sphere_od || "0.00"}</span>
                        <span>Cilindro: {evaluation.prescription.cylinder_od || "0.00"}</span>
                        <span>Eje: {evaluation.prescription.axis_od || "0°"}</span>
                        <span>Adición: {evaluation.prescription.addition_od || "0.00"}</span>
                      </div>
                    </div>
                    <div className="prescription-detail__eye">
                      <h4>Ojo Izquierdo (OI)</h4>
                      <div className="prescription-detail__values">
                        <span>Esfera: {evaluation.prescription.sphere_oi || "0.00"}</span>
                        <span>Cilindro: {evaluation.prescription.cylinder_oi || "0.00"}</span>
                        <span>Eje: {evaluation.prescription.axis_oi || "0°"}</span>
                        <span>Adición: {evaluation.prescription.addition_oi || "0.00"}</span>
                      </div>
                    </div>
                  </div>
                  {evaluation.prescription.pd && (
                    <div className="prescription-detail__pd">
                      <span>Distancia Pupilar (PD): {evaluation.prescription.pd}</span>
                    </div>
                  )}
                  {evaluation.prescription.notes && (
                    <div className="prescription-detail__notes">
                      <span>Notas: {evaluation.prescription.notes}</span>
                    </div>
                  )}
                  {evaluation.prescription.expires_at && (
                    <div className="prescription-detail__expiry">
                      <span>Vence: {evaluation.prescription.expires_at}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="appointment-detail__empty">
                  <MuiSvgIcon size={32}>lucide:file-text</MuiSvgIcon>
                  <p>No se ha creado una prescripción para esta evaluación.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
