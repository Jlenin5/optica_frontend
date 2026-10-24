import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useAppointment } from "@appointments/hooks/useAppointment"
import { useCreatePrescription } from "../hooks/useCreatePrescription"
import { useUpdatePrescription } from "../hooks/useUpdatePrescription"
import { PrescriptionForm } from "../components/PrescriptionForm"
import { PrescriptionView } from "../components/PrescriptionView"
import { PrescriptionSkeleton } from "../components/PrescriptionSkeleton"
import "@styles/prescriptions.scss"

// Muestra/edita la prescripción (1:1) de la consulta clínica vinculada a la cita.
// Cadena: Appointment -> Consultation -> Prescription
export const PrescriptionPage = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)

  const { data: appointment, isLoading: appointmentLoading } = useAppointment(Number(appointmentId))
  const { mutate: createPrescription, isPending: isCreating } = useCreatePrescription()
  const { mutate: updatePrescription, isPending: isUpdating } = useUpdatePrescription()

  const consultation = appointment?.consultation
  const existingPrescription = consultation?.prescription || null

  const handleSubmit = (prescriptionData: any) => {
    if (consultation && consultation.status !== "completed") return
    if (existingPrescription) {
      updatePrescription(
        { id: existingPrescription.id, data: prescriptionData },
        {
          onSuccess: () => {
            setIsEditing(false)
          }
        }
      )
    } else if (consultation) {
      createPrescription(
        {
          ...prescriptionData,
          consultation_id: consultation.id
        },
        {
          onSuccess: () => {
            setIsEditing(false)
          }
        }
      )
    }
  }

  if (appointmentLoading) {
    return <PrescriptionSkeleton />
  }

  if (!appointment) {
    return (
      <div className="prescription-error">
        <div className="prescription-error__content">
          <h2>Cita no encontrada</h2>
          <p>No se encontró la cita solicitada</p>
          <button onClick={() => navigate('/appointments/calendar')}>
            Volver a Citas
          </button>
        </div>
      </div>
    )
  }

  if (!consultation) {
    return (
      <div className="prescription-error">
        <div className="prescription-error__content">
          <h2>Consulta no registrada</h2>
          <p>Esta cita aún no tiene una consulta clínica registrada. La prescripción se crea a partir de una consulta.</p>
          <button onClick={() => navigate(`/appointments/${appointmentId}`)}>
            Volver al Detalle de la Cita
          </button>
        </div>
      </div>
    )
  }

  const patientName = appointment?.patient
    ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
    : 'Paciente no especificado'

  return (
    <div className="prescription-page">
      <div className="prescription-page__header">
        <button
          className="prescription-page__back-btn"
          onClick={() => navigate('/appointments/calendar')}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div>
          <h1 className="prescription-page__title">
            {existingPrescription ? 'Editar Prescripción' : 'Nueva Prescripción'}
          </h1>
          <p className="prescription-page__subtitle">
            Paciente: {patientName}
          </p>
          <p className="prescription-page__subtitle">
            Fecha de cita: {format(new Date(appointment.date), "dd/MM/yyyy", { locale: es })}
          </p>
        </div>
      </div>

      {consultation.status !== "completed" && (
        <div className="prescription-error">
          <div className="prescription-error__content">
            <h2>Consulta no completada</h2>
            <p>La prescripción interna solo puede registrarse cuando la consulta clínica esté completada.</p>
            <button onClick={() => navigate(`/consultations/${consultation.id}`)}>Volver a la Consulta</button>
          </div>
        </div>
      )}

      <div className="prescription-page__content">
        {consultation.status !== "completed" ? null : (!isEditing && existingPrescription ? (
          <PrescriptionView
            prescription={existingPrescription}
            onEdit={() => consultation.status === "completed" && setIsEditing(true)}
          />
        ) : (
          <PrescriptionForm
            initialData={existingPrescription}
            onSubmit={handleSubmit}
            onCancel={() => {
              if (existingPrescription) {
                setIsEditing(false)
              } else {
                navigate('/appointments')
              }
            }}
            isSubmitting={isCreating || isUpdating}
            consultationId={consultation.id}
            patientId={appointment.patient?.id}
            fixedSourceType="INTERNAL"
          />
        ))}
      </div>
    </div>
  )
}
