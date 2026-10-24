import { useNavigate } from "react-router-dom"
import type { Appointment } from "../types/appointments.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface PatientAppointmentsListProps {
  appointments: Appointment[]
  onView?: (appointment: Appointment) => void
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy", { locale: es })
}

const formatTime = (time: string) => {
  return time.substring(0, 5)
}

const getStatusConfig = (status: string) => {
  const configs: Record<string, { label: string; color: string; bgColor: string }> = {
    scheduled: {
      label: 'Agendada',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    confirmed: {
      label: 'Confirmada',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    in_progress: {
      label: 'En Progreso',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    },
    completed: {
      label: 'Completada',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    cancelled: {
      label: 'Cancelada',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    },
    no_show: {
      label: 'No Asistió',
      color: '#6b7280',
      bgColor: 'rgba(107, 114, 128, 0.1)'
    }
  }
  return configs[status] || configs.scheduled
}

export const PatientAppointmentsList = ({ appointments, onView }: PatientAppointmentsListProps) => {
  const navigate = useNavigate()

  const handleViewAppointment = (appointment: Appointment) => {
    if (onView) {
      onView(appointment)
    } else {
      navigate(`/appointments/${appointment.id}`)
    }
  }

  if (appointments.length === 0) {
    return (
      <div className="patient-appointments-empty">
        <MuiSvgIcon size={48}>lucide:calendar-x</MuiSvgIcon>
        <h4>No hay citas registradas</h4>
        <p>Este paciente aún no tiene citas programadas</p>
      </div>
    )
  }

  return (
    <div className="patient-appointments-list">
      {appointments.map((appointment) => {
        const statusConfig = getStatusConfig(appointment.status)
        const isPast = new Date(appointment.date) < new Date()
        const isToday = new Date(appointment.date).toDateString() === new Date().toDateString()
        
        return (
          <div 
            key={appointment.id} 
            className="patient-appointment-card"
            onClick={() => handleViewAppointment(appointment)}
          >
            <div className="patient-appointment-card__date">
              <div className="patient-appointment-card__day">
                {formatDate(appointment.date).split('/')[0]}
              </div>
              <div className="patient-appointment-card__month">
                {formatDate(appointment.date).split('/')[1]}
              </div>
            </div>
            
            <div className="patient-appointment-card__content">
              <div className="patient-appointment-card__header">
                <div className="patient-appointment-card__time">
                  <MuiSvgIcon size={14}>lucide:clock</MuiSvgIcon>
                  <span>{formatTime(appointment.time)}</span>
                </div>
                {isToday && (
                  <span className="patient-appointment-card__today-badge">Hoy</span>
                )}
                {isPast && appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                  <span className="patient-appointment-card__past-badge">Pasada</span>
                )}
              </div>
              
              <div className="patient-appointment-card__info">
                <div className="patient-appointment-card__optometrist">
                  <MuiSvgIcon size={14}>lucide:user</MuiSvgIcon>
                  <span>{appointment.optometrist?.username || 'No asignado'}</span>
                </div>
                {appointment.notes && (
                  <div className="patient-appointment-card__notes" title={appointment.notes}>
                    <MuiSvgIcon size={14}>lucide:file-text</MuiSvgIcon>
                    <span>{appointment.notes.length > 50 ? appointment.notes.substring(0, 50) + '...' : appointment.notes}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="patient-appointment-card__status">
              <span 
                className="patient-appointment-card__status-badge"
                style={{ backgroundColor: statusConfig.bgColor, color: statusConfig.color }}
              >
                {statusConfig.label}
              </span>
            </div>
            
            <div className="patient-appointment-card__arrow">
              <MuiSvgIcon size={16}>lucide:chevron-right</MuiSvgIcon>
            </div>
          </div>
        )
      })}
    </div>
  )
}