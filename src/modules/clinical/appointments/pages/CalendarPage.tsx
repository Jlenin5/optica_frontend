import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns"
import { CalendarView, type CalendarViewMode } from "../components/CalendarView"
import { CreateAppointmentModal, type CreateAppointmentModalPrefill } from "../components/CreateAppointmentModal"
import { useCalendarEvents } from "../hooks/useCalendarEvents"
import type { CalendarEvent } from "../types/appointments.types"
import { ROUTES } from "@/app/config/routes"
import MuiSvgIcon from "@/components/MuiSvgIcon"
import "@/styles/modules/appointments.scss"

export const CalendarPage = () => {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month")
  const [showOutOfOffice, setShowOutOfOffice] = useState(true)
  const [showAnonymous, setShowAnonymous] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalPrefill, setModalPrefill] = useState<CreateAppointmentModalPrefill>({})

  const range = useMemo(() => {
    if (viewMode === "month") {
      const s = startOfWeek(startOfMonth(selectedDate), { weekStartsOn: 0 })
      const e = endOfWeek(endOfMonth(selectedDate), { weekStartsOn: 0 })
      return { start: format(s, "yyyy-MM-dd"), end: format(e, "yyyy-MM-dd") }
    }
    if (viewMode === "week") {
      const s = startOfWeek(selectedDate, { weekStartsOn: 1 })
      const e = endOfWeek(selectedDate, { weekStartsOn: 1 })
      return { start: format(s, "yyyy-MM-dd"), end: format(e, "yyyy-MM-dd") }
    }
    const d = format(selectedDate, "yyyy-MM-dd")
    return { start: d, end: d }
  }, [selectedDate, viewMode])

  const { data: events = [], isLoading, isError, refetch } = useCalendarEvents(
    range.start,
    range.end,
  )

  const openCreateModal = (prefill: CreateAppointmentModalPrefill = {}) => {
    setModalPrefill({
      date: prefill.date || format(selectedDate, "yyyy-MM-dd"),
      time: prefill.time,
      patientId: prefill.patientId,
    })
    setModalOpen(true)
  }

  const handleEventClick = (event: CalendarEvent) => {
    navigate(`/appointments/${event.id}`)
  }

  const handleSlotClick = (date: Date, time?: string) => {
    openCreateModal({
      date: format(date, "yyyy-MM-dd"),
      time,
    })
  }

  return (
    <div className="appointments-calendar-page">
      <header className="appointments-calendar-page__header">
        <div>
          <div className="eyebrow">Clínica</div>
          <h1>Agenda de citas</h1>
          <p>
            Visualiza, agenda y gestiona las citas de pacientes y optometristas.
          </p>
        </div>
        <div className="appointments-calendar-page__actions">
          <button
            type="button"
            className="cal-btn"
            onClick={() => navigate(ROUTES.APPOINTMENTS || "/appointments")}
          >
            <MuiSvgIcon size={18}>lucide:list</MuiSvgIcon>
            Lista de citas
          </button>
          <button
            type="button"
            className="cal-btn cal-btn--primary"
            onClick={() => openCreateModal()}
          >
            <MuiSvgIcon size={18}>lucide:plus</MuiSvgIcon>
            Nueva cita
          </button>
        </div>
      </header>

      <div className="cal-filters">
        <label className="cal-filters__check">
          <input
            type="checkbox"
            checked={showOutOfOffice}
            onChange={(e) => setShowOutOfOffice(e.target.checked)}
          />
          <span className="swatch" style={{ background: "#9ca3af" }} />
          Out of Office
        </label>
        <label className="cal-filters__check">
          <input
            type="checkbox"
            checked={showAnonymous}
            onChange={(e) => setShowAnonymous(e.target.checked)}
          />
          <span className="swatch" style={{ background: "#64748b" }} />
          Anonymous
        </label>
        <button
          type="button"
          className="cal-btn cal-btn--ghost"
          onClick={() => refetch()}
          title="Actualizar"
        >
          <MuiSvgIcon size={16}>lucide:refresh-cw</MuiSvgIcon>
        </button>
      </div>

      {isLoading && <div className="cal-loading">Cargando agenda…</div>}

      {isError && (
        <div className="cal-error">
          No se pudo cargar la agenda.
          <button type="button" className="cal-btn" onClick={() => refetch()}>
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <CalendarView
          events={events}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onEventClick={handleEventClick}
          onSlotClick={handleSlotClick}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showOutOfOffice={showOutOfOffice}
          showAnonymous={showAnonymous}
        />
      )}

      <CreateAppointmentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => {
          refetch()
        }}
        prefill={modalPrefill}
      />
    </div>
  )
}

export default CalendarPage
