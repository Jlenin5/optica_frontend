import { useState } from "react"
import type { Patient } from "@/modules/clinical/patients/types/patients.types"
import type { User } from "@users/types/users.types"
import type { Appointment } from "../types/appointments.types"

interface AppointmentFormProps {
  patients: Patient[]
  optometrists: User[]
  onSubmit: (data: any) => void
  onCancel: () => void
  isSubmitting?: boolean
  initialData?: Appointment
}

export const AppointmentForm = ({
  patients,
  optometrists,
  onSubmit,
  onCancel,
  isSubmitting,
  initialData
}: AppointmentFormProps) => {
  const [formData, setFormData] = useState({
    patient_id: initialData?.patient_id || '',
    optometrist_id: initialData?.optometrist_id || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    time: initialData?.time || '09:00',
    notes: initialData?.notes || '',
    status: initialData?.status || 'scheduled'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
  ]

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.patient_id) {
      newErrors.patient_id = "Seleccione un paciente"
    }

    if (!formData.date) {
      newErrors.date = "Seleccione una fecha"
    }

    if (!formData.time) {
      newErrors.time = "Seleccione una hora"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    onSubmit({
      patient_id: Number(formData.patient_id),
      optometrist_id: formData.optometrist_id ? Number(formData.optometrist_id) : null,
      date: formData.date,
      time: formData.time,
      notes: formData.notes || null,
      status: formData.status
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <form className="appointment-form" onSubmit={handleSubmit}>
      <div className="appointment-form__section">
        <div className="appointment-form__row">
          <div className="appointment-form__field">
            <label className="appointment-form__label">
              Cliente <span className="appointment-form__required">*</span>
            </label>
            <select
              name="patient_id"
              className={`appointment-form__select ${errors.patient_id ? 'appointment-form__select--error' : ''}`}
              value={formData.patient_id}
              onChange={handleChange}
            >
              <option value="">Seleccionar cliente</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.first_name} {patient.last_name} - {patient.document_number}
                </option>
              ))}
            </select>
            {errors.patient_id && <span className="appointment-form__error">{errors.patient_id}</span>}
          </div>

          <div className="appointment-form__field">
            <label className="appointment-form__label">Optometrista</label>
            <select
              name="optometrist_id"
              className="appointment-form__select"
              value={formData.optometrist_id}
              onChange={handleChange}
            >
              <option value="">No asignar</option>
              {optometrists.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.username}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="appointment-form__row">
          <div className="appointment-form__field">
            <label className="appointment-form__label">
              Fecha <span className="appointment-form__required">*</span>
            </label>
            <input
              type="date"
              name="date"
              className={`appointment-form__input ${errors.date ? 'appointment-form__input--error' : ''}`}
              value={formData.date}
              onChange={handleChange}
            />
            {errors.date && <span className="appointment-form__error">{errors.date}</span>}
          </div>

          <div className="appointment-form__field">
            <label className="appointment-form__label">
              Hora <span className="appointment-form__required">*</span>
            </label>
            <select
              name="time"
              className={`appointment-form__select ${errors.time ? 'appointment-form__select--error' : ''}`}
              value={formData.time}
              onChange={handleChange}
            >
              <option value="">Seleccionar hora</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.time && <span className="appointment-form__error">{errors.time}</span>}
          </div>
        </div>

        <div className="appointment-form__field">
          <label className="appointment-form__label">Notas</label>
          <textarea
            name="notes"
            className="appointment-form__textarea"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Motivo de la consulta, observaciones, etc..."
          />
        </div>

        <div className="appointment-form__field appointment-form__field--checkbox">
          <label className="appointment-form__checkbox-label">
            <input
              type="checkbox"
              name="status"
              checked={formData.status === 'scheduled'}
              onChange={handleChange}
            />
            <span>Cita activa</span>
          </label>
        </div>
      </div>

      <div className="appointment-form__actions">
        <button
          type="button"
          className="appointment-form__button appointment-form__button--secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="appointment-form__button appointment-form__button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="appointment-form__spinner"></span>
              Agendando...
            </>
          ) : (
            'Agendar Cita'
          )}
        </button>
      </div>
    </form>
  )
}