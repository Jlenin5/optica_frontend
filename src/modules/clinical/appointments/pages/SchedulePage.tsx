import { useState, useEffect, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useCreateAppointment } from "../hooks/useCreateAppointment"
import { usePatients } from "@/modules/clinical/patients/hooks/usePatients"
import { usePatient } from "@/modules/clinical/patients/hooks/usePatient"
import { useUsers } from "@users/hooks/useUsers"
import { useAuthStore } from "@/app/store/auth.store"
import { TimeSlotPicker } from "../components/schedules/TimeSlotPicker"
import { PatientSearch } from "../components/schedules/PatientSearch"
import { AppointmentSummary } from "../components/schedules/AppointmentSummary"
import type { Patient } from "@/modules/clinical/patients/types/patients.types"
import MuiSvgIcon from "@/components/MuiSvgIcon"
import "@styles/schedule.scss"

export const SchedulePage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, currentCompanyId, isSuperAdmin } = useAuthStore()
  const { mutate: createAppointment, isPending } = useCreateAppointment()

  // Obtener parámetros de URL
  const searchParams = new URLSearchParams(location.search)
  const patientIdFromUrl = searchParams.get('patient_id')
  const appointmentIdFromUrl = searchParams.get('appointment_id')

  // Estado del formulario
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return searchParams.get('date') || new Date().toISOString().split('T')[0]
  })
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedOptometrist, setSelectedOptometrist] = useState<number | null>(() => {
    // If current user is an optometrist, default to their id
    return user?.role?.name === 'optometra' ? user?.id ?? null : null
  })
  const [notes, setNotes] = useState<string>("")
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  // const [isLoadingPatient, setIsLoadingPatient] = useState(false)

  // Cargar cliente si viene por ID en URL
  const { data: patientById, isLoading: patientByIdLoading } = usePatient(
    patientIdFromUrl ? Number(patientIdFromUrl) : 0,
    { enabled: !!patientIdFromUrl }
  )

  // Obtener clientes de la empresa
  const { data: patientsData, isLoading: patientsLoading } = usePatients({
    company_id: !isSuperAdmin ? currentCompanyId || undefined : undefined,
  })
  
  const roleName = user?.role?.name
  const isOptometra = roleName === "optometra"
  
  // Obtener optometristas
  const { data: usersData } = useUsers({
    status: true,
    role_id: isOptometra ? user?.role?.id : undefined,
    role_name: roleName === "optometra" ? "optometra" : undefined
  }, {
    enabled: !isOptometra
  })

  const patients = patientsData?.pages.flatMap(page => page.results) || []
  const optometrists = usersData?.pages.flatMap(page => page.results) || []

  // If user becomes available later and is optometrist, ensure selected optometrist is set
  useEffect(() => {
    if (isOptometra && user?.id && selectedOptometrist !== user.id) {
      // Use timeout to avoid synchronous state update during render/effect execution
      const t = setTimeout(() => setSelectedOptometrist(user.id), 0)
      return () => clearTimeout(t)
    }
  }, [isOptometra, user?.id, selectedOptometrist])

  // Horarios disponibles
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
  ]

  // Cargar cliente desde URL si existe
  useEffect(() => {
    if (patientById && patientIdFromUrl && patientById.id === Number(patientIdFromUrl)) {
      const t = setTimeout(() => setSelectedPatient(patientById), 0)
      // setStep(2)
      return () => clearTimeout(t)
      // Si el cliente viene de URL, avanzar al paso 2 automáticamente
    }
  }, [patientById, patientIdFromUrl])

  // Validar paso actual
  const validateStep1 = useCallback(() => {
    const newErrors: Record<string, string> = {}
    if (!selectedPatient) {
      newErrors.patient = "Debe seleccionar un cliente"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [selectedPatient])

  const validateStep2 = useCallback(() => {
    const newErrors: Record<string, string> = {}
    if (!selectedDate) {
      newErrors.date = "Debe seleccionar una fecha"
    }
    if (!selectedTime) {
      newErrors.time = "Debe seleccionar una hora"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [selectedDate, selectedTime])

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3)
    }
  }

  const handleSubmit = () => {

    createAppointment({
      patient_id: selectedPatient?.id || null,
      optometrist_id: selectedOptometrist,
      date: selectedDate,
      time: selectedTime,
      notes: notes || null
    }, {
      onSuccess: () => {
        // Redirigir según de dónde venimos
        if (appointmentIdFromUrl) {
          navigate(`/appointments/${appointmentIdFromUrl}`)
        } else if (patientIdFromUrl) {
          navigate(`/patients/${patientIdFromUrl}`)
        } else {
          navigate('/appointments/calendar')
        }
      }
    })
  }

  const handlePatientSelect = (patient: Patient | null) => {
    setSelectedPatient(patient)
    if (step === 1) {
      setTimeout(() => setStep(2), 300)
    }
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    setSelectedTime("") // Resetear hora al cambiar fecha
  }

  const getAppointmentSummary = () => {
    if (!selectedPatient) return null
    
    return {
      patient: `${selectedPatient.first_name} ${selectedPatient.last_name}`,
      document: selectedPatient.document_number,
      phone: selectedPatient.phone,
      date: selectedDate,
      time: selectedTime,
      optometrist: optometrists.find(o => o.id === selectedOptometrist)?.username,
      notes
    }
  }

  // Mostrar loading si estamos cargando un cliente por ID
  if (patientIdFromUrl && patientByIdLoading) {
    return (
      <div className="schedule-loading">
        <div className="schedule-loading__spinner"></div>
        <p>Cargando información del cliente...</p>
      </div>
    )
  }

  return (
    <div className="schedule-page">
      {/* Header */}
      <div className="schedule-page__header">
        <button 
          className="schedule-page__back-btn"
          onClick={() => {
            if (patientIdFromUrl) {
              navigate(`/patients/${patientIdFromUrl}`)
            } else {
              navigate('/appointments')
            }
          }}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div>
          <h1 className="schedule-page__title">Agendar Nueva Cita</h1>
          <p className="schedule-page__subtitle">
            Completa los siguientes pasos para agendar una cita
          </p>
        </div>
      </div>

      {/* Steps Indicator - Ocultar si el cliente ya está seleccionado desde URL */}
      {!patientIdFromUrl && (
        <div className="schedule-page__steps">
          <div className={`schedule-step ${step >= 1 ? 'schedule-step--active' : ''} ${step > 1 ? 'schedule-step--completed' : ''}`}>
            <div className="schedule-step__number">1</div>
            <div className="schedule-step__label">Seleccionar Cliente</div>
          </div>
          <div className="schedule-step__line"></div>
          <div className={`schedule-step ${step >= 2 ? 'schedule-step--active' : ''} ${step > 2 ? 'schedule-step--completed' : ''}`}>
            <div className="schedule-step__number">2</div>
            <div className="schedule-step__label">Fecha y Hora</div>
          </div>
          <div className="schedule-step__line"></div>
          <div className={`schedule-step ${step >= 3 ? 'schedule-step--active' : ''}`}>
            <div className="schedule-step__number">3</div>
            <div className="schedule-step__label">Confirmar</div>
          </div>
        </div>
      )}

      {/* Mostrar información del cliente si viene desde URL */}
      {patientIdFromUrl && selectedPatient && (
        <div className="schedule-page__patient-info">
          <div className="patient-info-card">
            <div className="patient-info-card__avatar">
              {selectedPatient.first_name?.charAt(0).toUpperCase()}
              {selectedPatient.last_name?.charAt(0).toUpperCase()}
            </div>
            <div className="patient-info-card__details">
              <h3>{selectedPatient.first_name} {selectedPatient.last_name}</h3>
              <div className="patient-info-card__meta">
                <span>
                  <MuiSvgIcon size={14}>lucide:credit-card</MuiSvgIcon>
                  {selectedPatient.document_number}
                </span>
                <span>
                  <MuiSvgIcon size={14}>lucide:phone</MuiSvgIcon>
                  {selectedPatient.phone || 'Sin teléfono'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="schedule-page__content">
        {/* Paso 1: Seleccionar Cliente - solo mostrar si no viene desde URL */}
        {step === 1 && !patientIdFromUrl && (
          <div className="schedule-step-content">
            <div className="schedule-step-content__header">
              <h2>Seleccionar Cliente</h2>
              <p>Busca un cliente existente para agendar la cita</p>
            </div>
            <PatientSearch
              patients={patients}
              onSelect={handlePatientSelect}
              selectedPatient={selectedPatient}
              isLoading={patientsLoading}
            />
            {errors.patient && (
              <div className="schedule-step-content__error">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 8V12M12 16H12.01M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>{errors.patient}</span>
              </div>
            )}
          </div>
        )}

        {/* Paso 2: Fecha y Hora - siempre se muestra cuando step >= 2 */}
        {step === 2 && (
          <div className="schedule-step-content">
            <div className="schedule-step-content__header">
              <h2>Seleccionar Fecha y Hora</h2>
              <p>Elige la fecha y hora disponible para la cita</p>
            </div>
            <div className="schedule-step-content__form">
              <div className="schedule-form__field">
                <label className="schedule-form__label">
                  Fecha <span className="schedule-form__required">*</span>
                </label>
                <input
                  type="date"
                  className={`schedule-form__input ${errors.date ? 'schedule-form__input--error' : ''}`}
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.date && <span className="schedule-form__error">{errors.date}</span>}
              </div>

              <TimeSlotPicker
                timeSlots={timeSlots}
                selectedTime={selectedTime}
                onSelectTime={setSelectedTime}
                date={selectedDate}
                error={errors.time}
              />

              <div className="schedule-form__field">
                <label className="schedule-form__label">
                  Optometrista {!isOptometra && <span className="schedule-form__optional">(Opcional)</span>}
                </label>
                {isOptometra ? (
                  <input
                    type="text"
                    className="schedule-form__input schedule-form__input--disabled"
                    value={user?.username || user?.email || user?.role?.name}
                    disabled
                    readOnly
                  />
                ) : (
                  <select
                    className="schedule-form__select"
                    value={selectedOptometrist || ""}
                    onChange={(e) => setSelectedOptometrist(
                      e.target.value ? Number(e.target.value) : null
                    )}
                  >
                    <option value="">No asignar</option>
                    {optometrists.map(opt => (
                      <option key={opt.id} value={opt.id}>
                        {opt.username}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="schedule-form__field">
                <label className="schedule-form__label">Notas (Opcional)</label>
                <textarea
                  className="schedule-form__textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Motivo de la consulta, observaciones especiales, etc..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Paso 3: Confirmar */}
        {step === 3 && (
          <div className="schedule-step-content">
            <div className="schedule-step-content__header">
              <h2>Confirmar Cita</h2>
              <p>Revisa los detalles de la cita antes de confirmar</p>
            </div>
            <AppointmentSummary summary={getAppointmentSummary()} />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="schedule-page__actions">
        {step > 1 && step < 3 && (
          <button
            className="schedule-page__btn schedule-page__btn--secondary"
            onClick={handlePrevStep}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Anterior
          </button>
        )}
        
        {step < 3 ? (
          <button
            className="schedule-page__btn schedule-page__btn--primary"
            onClick={handleNextStep}
          >
            Siguiente
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        ) : (
          <button
            className="schedule-page__btn schedule-page__btn--success"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="schedule-page__spinner"></span>
                Agendando...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Confirmar Cita
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}