import { useState, useRef, useEffect } from 'react'
import MuiSvgIcon from '@components/MuiSvgIcon'
import type { AppointmentStatus } from "../types/appointments.types"

interface AppointmentStatusDropdownProps {
  currentStatus: AppointmentStatus
  onStatusChange: (status: AppointmentStatus) => void
  isUpdating?: boolean
  isFuture?: boolean
}

// Configuración de estados con transiciones permitidas
const statusConfig: Record<AppointmentStatus, {
  label: string
  icon: string
  color: string
  allowedTransitions: AppointmentStatus[]
  requiresConfirmation: boolean
  confirmationMessage?: string
}> = {
  scheduled: {
    label: 'Agendada',
    icon: 'lucide:calendar',
    color: '#3b82f6',
    allowedTransitions: ['confirmed', 'cancelled'],
    requiresConfirmation: false
  },
  confirmed: {
    label: 'Confirmada',
    icon: 'lucide:circle-check',
    color: '#10b981',
    allowedTransitions: ['in_progress', 'cancelled'],
    requiresConfirmation: false
  },
  in_progress: {
    label: 'En Progreso',
    icon: 'lucide:loader',
    color: '#f59e0b',
    allowedTransitions: ['completed', 'cancelled'],
    requiresConfirmation: false
  },
  completed: {
    label: 'Completada',
    icon: 'lucide:circle-check',
    color: '#10b981',
    allowedTransitions: [],
    requiresConfirmation: true,
    confirmationMessage: '¿Confirmas que la cita ha sido completada? Esta acción no se puede deshacer.'
  },
  cancelled: {
    label: 'Cancelada',
    icon: 'lucide:circle-x',
    color: '#ef4444',
    allowedTransitions: [],
    requiresConfirmation: true,
    confirmationMessage: '¿Estás seguro de que deseas cancelar esta cita?'
  },
  no_show: {
    label: 'No Asistió',
    icon: 'lucide:user-x',
    color: '#6b7280',
    allowedTransitions: [],
    requiresConfirmation: true,
    confirmationMessage: '¿Confirmar que el cliente no asistió a la cita?'
  }
}

// Orden de estados para mostrar en el dropdown
const statusOrder: AppointmentStatus[] = [
  'scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'
]

export const AppointmentStatusDropdown = ({ 
  currentStatus, 
  onStatusChange, 
  isUpdating,
  isFuture = true
}: AppointmentStatusDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const currentConfig = statusConfig[currentStatus]
  
  // Filtrar estados disponibles según transiciones permitidas
  const availableStatuses = statusOrder.filter(status => {
    if (status === currentStatus) return false
    return currentConfig?.allowedTransitions?.includes(status)
  })
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const handleStatusChange = (status: AppointmentStatus) => {
    const config = statusConfig[status]
    
    if (config.requiresConfirmation) {
      if (confirm(config.confirmationMessage)) {
        onStatusChange(status)
      }
    } else {
      onStatusChange(status)
    }
    setIsOpen(false)
  }
  
  // Si no hay transiciones disponibles, mostrar solo el estado actual sin dropdown
  if (availableStatuses.length === 0) {
    return (
      <div className="appointment-status-display">
        <span 
          className="appointment-status-display__badge"
          style={{ backgroundColor: `${currentConfig?.color}15`, color: currentConfig?.color }}
        >
          <MuiSvgIcon size={14}>{currentConfig?.icon}</MuiSvgIcon>
          <span>{currentConfig?.label}</span>
        </span>
      </div>
    )
  }
  
  return (
    <div className="appointment-status-dropdown" ref={dropdownRef}>
      <button
        className="appointment-status-dropdown__trigger"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        style={{ backgroundColor: `${currentConfig.color}15`, color: currentConfig.color }}
      >
        <MuiSvgIcon size={16}>{currentConfig.icon}</MuiSvgIcon>
        <span>{currentConfig.label}</span>
        <MuiSvgIcon size={14} className="appointment-status-dropdown__chevron">
          {isOpen ? 'lucide:chevron-up' : 'lucide:chevron-down'}
        </MuiSvgIcon>
      </button>
      
      {isOpen && (
        <div className="appointment-status-dropdown__menu">
          {availableStatuses.map((status) => {
            const config = statusConfig[status]
            return (
              <button
                key={status}
                className="appointment-status-dropdown__option"
                onClick={() => handleStatusChange(status)}
                style={{ color: config.color }}
              >
                <MuiSvgIcon size={16}>{config.icon}</MuiSvgIcon>
                <span>{config.label}</span>
                {config.requiresConfirmation && (
                  <MuiSvgIcon size={12} className="appointment-status-dropdown__warning">
                    lucide:alert-circle
                  </MuiSvgIcon>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}