import { AppModal } from '@/components/ui/modal'
import { useState } from "react"
import { useUpdateAppointment } from "../hooks/useUpdateAppointment"
import { useDeleteAppointment } from "../hooks/useDeleteAppointment"
import type { CalendarEvent } from "../types/appointments.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface AppointmentModalProps {
  appointment: CalendarEvent
  onClose: () => void
  onRefresh: () => void
}

const formatDate = (date: string) => {
  return format(new Date(date), "EEEE, d 'de' MMMM yyyy", { locale: es })
}

const formatTime = (date: string) => {
  return format(new Date(date), "HH:mm", { locale: es })
}

export const AppointmentModal = ({ appointment, onClose, onRefresh }: AppointmentModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const { mutate: updateAppointment } = useUpdateAppointment()
  const { mutate: deleteAppointment } = useDeleteAppointment()

  const handleToggleStatus = () => {
    setIsToggling(true)
    updateAppointment(
      { id: appointment.id, data: { status: !appointment.status } },
      {
        onSuccess: () => {
          onRefresh()
          onClose()
        },
        onSettled: () => {
          setIsToggling(false)
        }
      }
    )
  }

  const handleDelete = () => {
    if (confirm("¿Estás seguro de que deseas eliminar esta cita?")) {
      setIsDeleting(true)
      deleteAppointment(appointment.id, {
        onSuccess: () => {
          onRefresh()
          onClose()
        },
        onSettled: () => {
          setIsDeleting(false)
        }
      })
    }
  }

  return (
    <AppModal
      title={appointment.patientName}
      onClose={onClose}
      headerContent={
        <div className="appointment-modal__header-left">
          <div className={`appointment-modal__status-badge appointment-modal__status-badge--${appointment.status ? 'active' : 'inactive'}`}>
            {appointment.status ? 'Activa' : 'Cancelada'}
          </div>
          <h3 className="appointment-modal__title">{appointment.patientName}</h3>
        </div>
      }
    >
        <div className="appointment-modal__content">
          <div className="appointment-modal__info">
            <div className="appointment-modal__info-row">
              <MuiSvgIcon size={18}>lucide:calendar</MuiSvgIcon>
              <span>{formatDate(appointment.start)}</span>
            </div>
            <div className="appointment-modal__info-row">
              <MuiSvgIcon size={18}>lucide:clock</MuiSvgIcon>
              <span>{formatTime(appointment.start)}</span>
            </div>
            {appointment.optometristName && (
              <div className="appointment-modal__info-row">
                <MuiSvgIcon size={18}>lucide:user</MuiSvgIcon>
                <span>Optometrista: {appointment.optometristName}</span>
              </div>
            )}
          </div>

          {appointment.notes && (
            <div className="appointment-modal__notes">
              <h4 className="appointment-modal__notes-title">Notas</h4>
              <p className="appointment-modal__notes-text">{appointment.notes}</p>
            </div>
          )}

          <div className="appointment-modal__actions">
            <button
              className={`appointment-modal__btn appointment-modal__btn--${appointment.status ? 'cancel' : 'activate'}`}
              onClick={handleToggleStatus}
              disabled={isToggling}
            >
              {isToggling ? (
                <span className="appointment-modal__spinner"></span>
              ) : (
                <>
                  <MuiSvgIcon size={18}>
                    {appointment.status ? 'lucide:x-circle' : 'lucide:check-circle'}
                  </MuiSvgIcon>
                  {appointment.status ? 'Cancelar Cita' : 'Activar Cita'}
                </>
              )}
            </button>
            <button
              className="appointment-modal__btn appointment-modal__btn--delete"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="appointment-modal__spinner"></span>
              ) : (
                <>
                  <MuiSvgIcon size={18}>lucide:trash-2</MuiSvgIcon>
                  Eliminar Cita
                </>
              )}
            </button>
          </div>
        </div>
    </AppModal>
  )
}