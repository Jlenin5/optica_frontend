import MuiSvgIcon from '@components/MuiSvgIcon'
import type { AppointmentStatus } from "../types/appointments.types"

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus
  onClick?: () => void
  size?: 'small' | 'medium'
  showLabel?: boolean
}

const statusConfig: Record<AppointmentStatus, {
  label: string
  icon: string
  color: string
  bgColor: string
  actions?: AppointmentStatus[]
}> = {
  scheduled: {
    label: 'Agendada',
    icon: 'lucide:calendar',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    actions: ['confirmed', 'cancelled']
  },
  confirmed: {
    label: 'Confirmada',
    icon: 'lucide:check-circle',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    actions: ['in_progress', 'cancelled']
  },
  in_progress: {
    label: 'En Progreso',
    icon: 'lucide:loader-2',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    actions: ['completed', 'cancelled']
  },
  completed: {
    label: 'Completada',
    icon: 'lucide:check-circle-2',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    actions: []
  },
  cancelled: {
    label: 'Cancelada',
    icon: 'lucide:x-circle',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    actions: []
  },
  no_show: {
    label: 'No Asistió',
    icon: 'lucide:user-x',
    color: '#6b7280',
    bgColor: 'rgba(107, 114, 128, 0.1)',
    actions: []
  }
}

export const AppointmentStatusBadge = ({ 
  status, 
  onClick, 
  size = 'medium',
  showLabel = true 
}: AppointmentStatusBadgeProps) => {
  const config = statusConfig[status]
  const iconSize = size === 'small' ? 14 : 16
  
  return (
    <div className="appointment-status">
      <button
        className={`appointment-status__badge appointment-status__badge--${size} ${onClick ? 'appointment-status__badge--clickable' : ''}`}
        style={{ backgroundColor: config.bgColor, color: config.color }}
        onClick={onClick}
        title={onClick ? 'Cambiar estado' : config.label}
      >
        <MuiSvgIcon size={iconSize}>{config.icon}</MuiSvgIcon>
        {showLabel && <span>{config.label}</span>}
      </button>
    </div>
  )
}