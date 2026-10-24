import { useEffect, useMemo, useState } from 'react'
import { AppModal } from '@/components/ui/modal'
import { useCreateAppointment } from '../hooks/useCreateAppointment'
import { usePatients } from '@/modules/clinical/patients/hooks/usePatients'
import { useUsers } from '@users/hooks/useUsers'
import { useAuthStore } from '@/app/store/auth.store'
import { PatientSearch } from './schedules/PatientSearch'
import type { Patient } from '@/modules/clinical/patients/types/patients.types'
import type {
  AppointmentType,
  CreateAppointmentDTO,
} from '../types/appointments.types'
import {
  APPOINTMENT_TYPE_LABELS,
} from '../types/appointments.types'
import { availableSlots, hasTimeConflict } from '../utils/appointmentRules'
import { useCalendarEvents } from '../hooks/useCalendarEvents'
import MuiSvgIcon from '@/components/MuiSvgIcon'
import { format, parseISO } from 'date-fns'

export interface CreateAppointmentModalPrefill {
  date?: string
  time?: string
  patientId?: number
}

interface CreateAppointmentModalProps {
  open: boolean
  onClose: () => void
  onCreated?: () => void
  prefill?: CreateAppointmentModalPrefill
}

const TIME_SLOTS_FALLBACK = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00',
]

const DURATION_OPTIONS = [15, 20, 30, 45, 60, 90]

export function CreateAppointmentModal({
  open,
  onClose,
  onCreated,
  prefill,
}: CreateAppointmentModalProps) {
  const { user, currentCompanyId, isSuperAdmin } = useAuthStore()
  const createMutation = useCreateAppointment()

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [date, setDate] = useState(prefill?.date || new Date().toISOString().slice(0, 10))
  const [time, setTime] = useState(prefill?.time || '')
  const [duration, setDuration] = useState(30)
  const [optometristId, setOptometristId] = useState<number | null>(
    user?.role?.name === 'optometra' ? user?.id ?? null : null,
  )
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('consulta')
  const [notes, setNotes] = useState('')
  const [internalNotes, setInternalNotes] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [room, setRoom] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Sync prefill when modal opens
  useEffect(() => {
    if (!open) return
    if (prefill?.date) setDate(prefill.date)
    if (prefill?.time) setTime(prefill.time)
    setErrors({})
  }, [open, prefill?.date, prefill?.time])

  const { data: patientsData, isLoading: patientsLoading } = usePatients({
    company_id: !isSuperAdmin ? currentCompanyId || undefined : undefined,
    limit: 200,
  })
  const patients = useMemo(() => {
    if (!patientsData) return []
    // support both paginated and flat
    const pages = (patientsData as any).pages
    if (pages) return pages.flatMap((p: any) => p.results || [])
    return (patientsData as any).results || (Array.isArray(patientsData) ? patientsData : [])
  }, [patientsData])

  const { data: usersData } = useUsers({
    role: 'optometra',
    company_id: !isSuperAdmin ? currentCompanyId || undefined : undefined,
    limit: 100,
  } as any)
  const optometrists = useMemo(() => {
    if (!usersData) return []
    const pages = (usersData as any).pages
    if (pages) return pages.flatMap((p: any) => p.results || [])
    return (usersData as any).results || (Array.isArray(usersData) ? usersData : [])
  }, [usersData])

  // Events of the selected day to compute free slots / conflicts
  const dayRange = { start: date, end: date }
  const { data: dayEvents = [] } = useCalendarEvents(dayRange.start, dayRange.end)

  const occupiedForOptometrist = useMemo(() => {
    return dayEvents
      .filter((ev) => {
        if (ev.isBlocked) return true
        if (optometristId == null) return true
        return ev.optometristId === optometristId
      })
      .map((ev) => {
        const t = format(parseISO(ev.start), 'HH:mm')
        return {
          time: t,
          duration_minutes: ev.durationMinutes ?? 30,
          optometrist_id: ev.optometristId,
          id: ev.id,
        }
      })
  }, [dayEvents, optometristId])

  const freeSlots = useMemo(() => {
    try {
      return availableSlots(occupiedForOptometrist, '08:00', '18:30', 30)
    } catch {
      return TIME_SLOTS_FALLBACK
    }
  }, [occupiedForOptometrist])

  // If current time is no longer free, clear it
  useEffect(() => {
    if (time && freeSlots.length > 0 && !freeSlots.includes(time) && !prefill?.time) {
      // keep prefilled time even if conflict (user must resolve)
    }
  }, [freeSlots, time, prefill?.time])

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (!selectedPatient) e.patient = 'Seleccione un paciente'
    if (!date) e.date = 'Seleccione una fecha'
    if (!time) e.time = 'Seleccione una hora'
    if (date && time && optometristId) {
      const conflict = hasTimeConflict(occupiedForOptometrist, {
        patient_id: selectedPatient?.id ?? null,
        optometrist_id: optometristId,
        date,
        time,
        duration_minutes: duration,
      })
      if (conflict) {
        e.time = 'El optometrista ya tiene una cita en ese horario'
      }
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate() || !selectedPatient) return

    const payload: CreateAppointmentDTO = {
      patient_id: selectedPatient.id,
      optometrist_id: optometristId,
      date,
      time,
      duration_minutes: duration,
      appointment_type: appointmentType,
      notes: notes || null,
      internal_notes: internalNotes || null,
      status: 'scheduled',
      is_anonymous: isAnonymous,
      room: room || null,
      company_id: currentCompanyId || undefined,
    }

    createMutation.mutate(payload, {
      onSuccess: () => {
        onCreated?.()
        resetAndClose()
      },
    })
  }

  const resetAndClose = () => {
    setSelectedPatient(null)
    setNotes('')
    setInternalNotes('')
    setIsAnonymous(false)
    setRoom('')
    setErrors({})
    onClose()
  }

  if (!open) return null

  return (
    <AppModal
      title="Nueva cita"
      description="Registre la cita del paciente sin salir de la agenda."
      onClose={resetAndClose}
      size="lg"
      closeOnOverlay={false}
      closeDisabled={createMutation.isPending}
      footer={
        <div className="create-appointment-modal__footer">
          <button
            type="button"
            className="cal-btn"
            onClick={resetAndClose}
            disabled={createMutation.isPending}
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="create-appointment-form"
            className="cal-btn cal-btn--primary"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <>
                <span className="appointment-form__spinner" />
                Guardando…
              </>
            ) : (
              <>
                <MuiSvgIcon size={16}>lucide:check</MuiSvgIcon>
                Agendar cita
              </>
            )}
          </button>
        </div>
      }
    >
      <form
        id="create-appointment-form"
        className="create-appointment-modal"
        onSubmit={handleSubmit}
      >
        {/* Paciente */}
        <section className="create-appointment-modal__section">
          <h4>Paciente</h4>
          <PatientSearch
            patients={patients}
            selectedPatient={selectedPatient}
            onSelect={setSelectedPatient}
            isLoading={patientsLoading}
          />
          {errors.patient && (
            <span className="create-appointment-modal__error">{errors.patient}</span>
          )}
          {selectedPatient && (
            <div className="create-appointment-modal__patient-chip">
              <MuiSvgIcon size={16}>lucide:user</MuiSvgIcon>
              <span>
                {selectedPatient.first_name} {selectedPatient.last_name}
                {selectedPatient.document_number
                  ? ` · ${selectedPatient.document_number}`
                  : ''}
              </span>
              <button
                type="button"
                className="create-appointment-modal__chip-clear"
                onClick={() => setSelectedPatient(null)}
                aria-label="Quitar paciente"
              >
                ×
              </button>
            </div>
          )}
        </section>

        {/* Fecha, hora, duración */}
        <section className="create-appointment-modal__section">
          <h4>Fecha y horario</h4>
          <div className="create-appointment-modal__grid">
            <div className="create-appointment-modal__field">
              <label>
                Fecha <span className="req">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={errors.date ? 'is-error' : ''}
              />
              {errors.date && (
                <span className="create-appointment-modal__error">{errors.date}</span>
              )}
            </div>

            <div className="create-appointment-modal__field">
              <label>
                Hora <span className="req">*</span>
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={errors.time ? 'is-error' : ''}
              >
                <option value="">Seleccionar…</option>
                {(freeSlots.length ? freeSlots : TIME_SLOTS_FALLBACK).map((s) => (
                  <option key={s} value={s}>
                    {s}
                    {!freeSlots.includes(s) ? ' (ocupado)' : ''}
                  </option>
                ))}
                {/* allow prefilled time even if not in free list */}
                {time && !freeSlots.includes(time) && !TIME_SLOTS_FALLBACK.includes(time) && (
                  <option value={time}>{time}</option>
                )}
              </select>
              {errors.time && (
                <span className="create-appointment-modal__error">{errors.time}</span>
              )}
            </div>

            <div className="create-appointment-modal__field">
              <label>Duración</label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                {DURATION_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d} min
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Optometrista y tipo */}
        <section className="create-appointment-modal__section">
          <h4>Profesional y tipo</h4>
          <div className="create-appointment-modal__grid">
            <div className="create-appointment-modal__field">
              <label>Optometrista</label>
              <select
                value={optometristId ?? ''}
                onChange={(e) =>
                  setOptometristId(e.target.value ? Number(e.target.value) : null)
                }
              >
                <option value="">Sin asignar</option>
                {optometrists.map((u: any) => (
                  <option key={u.id} value={u.id}>
                    {u.name || u.username || `${u.first_name || ''} ${u.last_name || ''}`.trim()}
                  </option>
                ))}
              </select>
            </div>

            <div className="create-appointment-modal__field">
              <label>Tipo de cita</label>
              <select
                value={appointmentType}
                onChange={(e) =>
                  setAppointmentType(e.target.value as AppointmentType)
                }
              >
                {(Object.keys(APPOINTMENT_TYPE_LABELS) as AppointmentType[]).map(
                  (t) => (
                    <option key={t} value={t}>
                      {APPOINTMENT_TYPE_LABELS[t]}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div className="create-appointment-modal__field">
              <label>Consultorio / box</label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Ej. Box 1"
              />
            </div>
          </div>
        </section>

        {/* Notas */}
        <section className="create-appointment-modal__section">
          <h4>Observaciones</h4>
          <div className="create-appointment-modal__field">
            <label>Notas para el paciente / agenda</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Motivo de la consulta, control, etc."
            />
          </div>
          <div className="create-appointment-modal__field">
            <label>Notas internas</label>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={2}
              placeholder="Solo visibles para el personal"
            />
          </div>
          <label className="create-appointment-modal__check">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            Mostrar como anónimo en la agenda (privacidad)
          </label>
        </section>
      </form>
    </AppModal>
  )
}
