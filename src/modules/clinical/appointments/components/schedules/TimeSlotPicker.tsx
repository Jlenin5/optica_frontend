import { useState, useMemo } from "react"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface TimeSlotPickerProps {
  timeSlots: string[]
  selectedTime: string
  onSelectTime: (time: string) => void
  date: string
  error?: string
}

export const TimeSlotPicker = ({ timeSlots, selectedTime, onSelectTime, date, error }: TimeSlotPickerProps) => {
  const [showAll, setShowAll] = useState(false)

  const visibleSlots = useMemo(() => {
    if (showAll) return timeSlots
    return timeSlots.slice(0, 12)
  }, [timeSlots, showAll])

  const isSlotAvailable = (time: string) => {
    // Aquí puedes agregar lógica para verificar disponibilidad
    // Por ejemplo, consultar citas existentes para esa fecha y hora
    return true
  }

  const getSlotStatus = (time: string) => {
    if (selectedTime === time) return 'selected'
    if (!isSlotAvailable(time)) return 'unavailable'
    return 'available'
  }

  return (
    <div className="time-slot-picker">
      <label className="time-slot-picker__label">
        Hora <span className="time-slot-picker__required">*</span>
      </label>
      <div className="time-slot-picker__grid">
        {visibleSlots.map((slot) => {
          const status = getSlotStatus(slot)
          return (
            <button
              key={slot}
              className={`time-slot-picker__slot time-slot-picker__slot--${status}`}
              onClick={() => status !== 'unavailable' && onSelectTime(slot)}
              disabled={status === 'unavailable'}
            >
              {slot}
              {status === 'selected' && (
                <MuiSvgIcon size={14}>lucide:check</MuiSvgIcon>
              )}
            </button>
          )
        })}
      </div>
      {timeSlots.length > 12 && (
        <button
          className="time-slot-picker__show-more"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Mostrar menos' : `Mostrar más (${timeSlots.length - 12} disponibles)`}
        </button>
      )}
      {error && <span className="time-slot-picker__error">{error}</span>}
    </div>
  )
}