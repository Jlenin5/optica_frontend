// modules/appointments/components/AppointmentTable.tsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDeleteAppointment } from "../hooks/useDeleteAppointment"
import { useUpdateAppointmentStatus } from "../hooks/useUpdateAppointmentStatus"
import { AppointmentStatusDropdown } from "./AppointmentStatusDropdown"
import type { Appointment, AppointmentStatus } from "../types/appointments.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { AppointmentConsultationModal } from "./AppointmentConsultationModal"

interface AppointmentTableProps {
  data: Appointment[]
  onRefresh: () => void
  isSuperAdmin: boolean
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy", { locale: es })
}

const formatTime = (time: string) => {
  return time.substring(0, 5)
}

// Estados que permiten edición de la cita
const EDITABLE_STATUSES: AppointmentStatus[] = ['scheduled', 'confirmed']

// Estados que permiten cancelación
const CANCELLABLE_STATUSES: AppointmentStatus[] = ['scheduled', 'confirmed', 'in_progress']

// Estados que permiten generar prescripción
const PRESCRIPTION_ALLOWED_STATUSES: AppointmentStatus[] = ['in_progress', 'completed']

// Estados que permiten crear venta
const SALE_ALLOWED_STATUSES: AppointmentStatus[] = ['completed']

export const AppointmentTable = ({ data, onRefresh, isSuperAdmin }: AppointmentTableProps) => {
  const navigate = useNavigate()
  const { mutate: deleteAppointment, isPending: isDeleting } = useDeleteAppointment()
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateAppointmentStatus()
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta cita?")) {
      setDeletingId(id)
      deleteAppointment(id, {
        onSuccess: () => {
          onRefresh()
        },
        onSettled: () => {
          setDeletingId(null)
        }
      })
    }
  }

  const handleStatusChange = (id: number, status: AppointmentStatus) => {
    // Confirmar cambios importantes
    if (status.toLowerCase() === 'cancelled') {
      if (!confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
        return
      }
    }
    
    if (status.toLowerCase() === 'completed') {
      if (!confirm("¿Confirmas que la cita ha sido completada? Una prescripción se registra desde la consulta clínica y no se genera automáticamente.")) {
        return
      }
    }
    
    updateStatus({ id, status }, {
      onSuccess: () => onRefresh()
    })
  }

  const handleViewPrescription = (appointment: Appointment) => {
    // La prescripción vive en Consultation (1:1), no directamente en la cita.
    // Si ya existe una consulta con prescripción, vamos a verla; si no, al detalle
    // de la cita para registrar primero la consulta clínica (de la cual sale la prescripción).
    if (appointment.consultation?.prescription) {
      navigate(`/appointments/${appointment.id}/prescription`)
    } else {
      navigate(`/appointments/${appointment.id}`)
    }
  }

  const getPatientName = (appointment: Appointment) => {
    if (appointment.patient) {
      return `${appointment.patient.first_name} ${appointment.patient.last_name}`
    }
    return 'Cliente no especificado'
  }

  const canEditAppointment = (status: AppointmentStatus) => {
    return EDITABLE_STATUSES.includes(status.toLowerCase() as AppointmentStatus)
  }

  const canCancelAppointment = (status: AppointmentStatus) => {
    return CANCELLABLE_STATUSES.includes(status.toLowerCase() as AppointmentStatus)
  }

  const canGeneratePrescription = (status: AppointmentStatus) => {
    return PRESCRIPTION_ALLOWED_STATUSES.includes(status.toLowerCase() as AppointmentStatus)
  }

  const canCreateSale = (status: AppointmentStatus) => {
    return SALE_ALLOWED_STATUSES.includes(status.toLowerCase() as AppointmentStatus)
  }

  const handleLinkConsultation = (appointment: Appointment) => {
    navigate(`/appointments/${appointment.id}`)
    setShowPrescriptionModal(true)
  }

  const handleCreateSale = (appointment: Appointment) => {
    navigate(`/sales/create?patient_id=${appointment.patient_id}&appointment_id=${appointment.id}`)
  }

  const hasPrescription = (appointment: Appointment) => {
    return !!appointment.consultation?.prescription
  }

  // Verificar si la cita es futura
  const isFutureAppointment = (date: string) => {
    const appointmentDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return appointmentDate >= today
  }

  return (
    <div className="appointment-table-container">
      <table className="appointment-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Optometrista</th>
            {
              isSuperAdmin && (
                <th>Empresa</th>
              )
            }
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((appointment) => (
            <tr key={appointment.id}>
              <td className="appointment-table__id">{appointment.id}</td>
              <td className="appointment-table__patient">
                <div className="appointment-table__patient-info">
                  {/* <div className="appointment-table__patient-avatar">
                    {getPatientName(appointment).charAt(0).toUpperCase()}
                  </div> */}
                  <div>
                    <div className="appointment-table__patient-name">
                      {getPatientName(appointment)}
                    </div>
                    <div className="appointment-table__patient-document">
                      {appointment.patient?.document_number || '-'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="appointment-table__date">
                {formatDate(appointment.date)}
              </td>
              <td className="appointment-table__time">
                <span className="appointment-table__time-badge">
                  {formatTime(appointment.time)}
                </span>
              </td>
              <td className="appointment-table__optometrist">
                {appointment.optometrist?.username || '-'}
              </td>
              {
                isSuperAdmin && (
                  <td className="type-of-receipt-table__company">
                    {appointment?.patient?.company?.name || '-'}
                  </td>
                )
              }
              <td className="appointment-table__status">
                <AppointmentStatusDropdown
                  currentStatus={appointment.status.toLowerCase() as AppointmentStatus}
                  onStatusChange={(status) => handleStatusChange(appointment.id, status)}
                  isUpdating={isUpdating}
                  isFuture={isFutureAppointment(appointment.date)}
                />
              </td>
              <td className="appointment-table__actions">
                {canEditAppointment(appointment.status) && isFutureAppointment(appointment.date) && (
                  <button
                    className="appointment-table__action-btn appointment-table__action-btn--edit"
                    onClick={() => navigate(`/appointments/${appointment.id}/edit`)}
                    title="Editar cita"
                  >
                    <MuiSvgIcon size={18}>
                      heroicons-outline:pencil-square
                    </MuiSvgIcon>
                  </button>
                )}

                {canGeneratePrescription(appointment.status) && (
                  hasPrescription(appointment) ? (
                    <button
                      className="appointment-table__action-btn appointment-table__action-btn--view-prescription"
                      onClick={() => handleViewPrescription(appointment)}
                      title="Ver prescripción"
                    >
                      <MuiSvgIcon size={18}>lucide:file-text</MuiSvgIcon>
                    </button>
                  ) : (
                    <button
                      className="appointment-table__action-btn appointment-table__action-btn--link-prescription"
                      onClick={() => handleLinkConsultation(appointment)}
                      title="Generar Evaluación"
                    >
                      <MuiSvgIcon size={18}>lucide:circle-plus</MuiSvgIcon>
                    </button>
                  )
                )}

                {canCreateSale(appointment.status) && (
                  <button
                    className="appointment-table__action-btn appointment-table__action-btn--sale"
                    onClick={() => handleCreateSale(appointment)}
                    title="Crear venta"
                  >
                    <MuiSvgIcon size={18}>lucide:shopping-cart</MuiSvgIcon>
                  </button>
                )}

                {canCancelAppointment(appointment.status) && appointment.status.toLowerCase() !== 'cancelled' && (
                  <button
                    className="appointment-table__action-btn appointment-table__action-btn--cancel"
                    onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                    disabled={isUpdating}
                    title="Cancelar cita"
                  >
                    <MuiSvgIcon size={18}>
                      lucide:circle-x
                    </MuiSvgIcon>
                  </button>
                )}

                {(appointment.status.toLowerCase() === 'cancelled' || appointment.status.toLowerCase() === 'completed') && (
                  <button
                    className="appointment-table__action-btn appointment-table__action-btn--delete"
                    onClick={() => handleDelete(appointment.id)}
                    disabled={isDeleting && deletingId === appointment.id}
                    title="Eliminar cita"
                  >
                    {isDeleting && deletingId === appointment.id ? (
                      <span className="appointment-table__spinner"></span>
                    ) : (
                      <MuiSvgIcon size={18}>lucide:trash-2</MuiSvgIcon>
                    )}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {showPrescriptionModal && selectedAppointment && (
        <AppointmentConsultationModal
          appointmentId={selectedAppointment.id}
          patientId={selectedAppointment.patient_id!}
          onClose={() => {
            setShowPrescriptionModal(false)
            setSelectedAppointment(null)
          }}
          onSuccess={() => onRefresh()}
        />
      )}
    </div>
  )
}