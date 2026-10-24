import { useMemo, useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  isToday as isTodayFn,
  parseISO,
  setHours,
  setMinutes,
} from "date-fns"
import { es } from "date-fns/locale"
import type { CalendarEvent, AppointmentStatus } from "../types/appointments.types"
import {
  APPOINTMENT_STATUS_COLORS,
  APPOINTMENT_STATUS_LABELS,
} from "../types/appointments.types"
import MuiSvgIcon from "@components/MuiSvgIcon"

export type CalendarViewMode = "month" | "week" | "day" | "list"

interface CalendarViewProps {
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
  onDateSelect: (date: Date) => void
  onSlotClick?: (date: Date, time?: string) => void
  selectedDate: Date
  viewMode?: CalendarViewMode
  onViewModeChange?: (mode: CalendarViewMode) => void
  /** Filtros visuales */
  showRecurring?: boolean
  showOutOfOffice?: boolean
  showSpecial?: boolean
  showAnonymous?: boolean
  optometristFilter?: number | null
}

const WEEK_DAYS_FULL = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
const WEEK_DAYS_MON = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

const HOUR_SLOTS = Array.from({ length: 13 }, (_, i) => i + 8) // 08:00 – 20:00

function getEventColor(event: CalendarEvent): string {
  if (event.isBlocked) return "#9ca3af"
  if (event.color) return event.color
  return APPOINTMENT_STATUS_COLORS[event.status] || "#3b82f6"
}

function formatEventLabel(event: CalendarEvent): string {
  if (event.isBlocked) return event.blockReason || "Bloqueado"
  if (event.isAnonymous) return "Anónimo"
  return event.patientName || event.title || "Cita"
}

export const CalendarView = ({
  events,
  onEventClick,
  onDateSelect,
  onSlotClick,
  selectedDate,
  viewMode: controlledMode,
  onViewModeChange,
  showOutOfOffice = true,
  showAnonymous = true,
  optometristFilter = null,
}: CalendarViewProps) => {
  const [internalMode, setInternalMode] = useState<CalendarViewMode>("month")
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate)

  const viewMode = controlledMode ?? internalMode
  const setViewMode = (m: CalendarViewMode) => {
    setInternalMode(m)
    onViewModeChange?.(m)
  }

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (ev.isBlocked && !showOutOfOffice) return false
      if (ev.isAnonymous && !showAnonymous) return false
      if (
        optometristFilter != null &&
        ev.optometristId != null &&
        ev.optometristId !== optometristFilter
      ) {
        return false
      }
      return true
    })
  }, [events, showOutOfOffice, showAnonymous, optometristFilter])

  const getEventsForDay = (date: Date) =>
    filteredEvents.filter((event) => {
      try {
        return isSameDay(parseISO(event.start), date)
      } catch {
        return false
      }
    })

  const goPrev = () => {
    if (viewMode === "month") setCurrentDate(subMonths(currentDate, 1))
    else if (viewMode === "week") setCurrentDate(subWeeks(currentDate, 1))
    else setCurrentDate(addDays(currentDate, -1))
  }

  const goNext = () => {
    if (viewMode === "month") setCurrentDate(addMonths(currentDate, 1))
    else if (viewMode === "week") setCurrentDate(addWeeks(currentDate, 1))
    else setCurrentDate(addDays(currentDate, 1))
  }

  const goToday = () => {
    const today = new Date()
    setCurrentDate(today)
    onDateSelect(today)
  }

  const title = useMemo(() => {
    if (viewMode === "month")
      return format(currentDate, "MMMM yyyy", { locale: es })
    if (viewMode === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 })
      const end = endOfWeek(currentDate, { weekStartsOn: 1 })
      return `${format(start, "d MMM", { locale: es })} – ${format(end, "d MMM yyyy", { locale: es })}`
    }
    return format(currentDate, "EEEE d 'de' MMMM yyyy", { locale: es })
  }, [currentDate, viewMode])

  // ——— MONTH VIEW ———
  const renderMonth = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

    return (
      <>
        <div className="cal-weekdays">
          {WEEK_DAYS_FULL.map((d) => (
            <div key={d} className="cal-weekday">
              {d}
            </div>
          ))}
        </div>
        <div className="cal-grid cal-grid--month">
          {days.map((day) => {
            const dayEvents = getEventsForDay(day)
            const inMonth = isSameMonth(day, currentDate)
            const selected = isSameDay(day, selectedDate)
            const today = isTodayFn(day)
            const hasBlocked = dayEvents.some((e) => e.isBlocked)

            return (
              <div
                key={day.toISOString()}
                className={[
                  "cal-day",
                  !inMonth && "cal-day--outside",
                  selected && "cal-day--selected",
                  today && "cal-day--today",
                  hasBlocked && "cal-day--blocked",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => {
                  onDateSelect(day)
                  onSlotClick?.(day)
                }}
              >
                <span className="cal-day__num">{format(day, "d")}</span>
                <div className="cal-day__events">
                  {dayEvents.slice(0, 4).map((ev) => (
                    <button
                      key={ev.id}
                      type="button"
                      className="cal-event-bar"
                      style={{
                        backgroundColor: getEventColor(ev),
                        opacity: ev.isBlocked ? 0.7 : 1,
                      }}
                      title={`${format(parseISO(ev.start), "HH:mm")} ${formatEventLabel(ev)}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!ev.isBlocked) onEventClick(ev)
                      }}
                    >
                      <span className="cal-event-bar__time">
                        {format(parseISO(ev.start), "h:mmaaa").replace(":00", "").toLowerCase()}
                      </span>
                      <span className="cal-event-bar__title">
                        {formatEventLabel(ev)}
                      </span>
                    </button>
                  ))}
                  {dayEvents.length > 4 && (
                    <div className="cal-day__more">
                      +{dayEvents.length - 4} más
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </>
    )
  }

  // ——— WEEK VIEW ———
  const renderWeek = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

    return (
      <div className="cal-week">
        <div className="cal-week__header">
          <div className="cal-week__gutter" />
          {days.map((d) => (
            <div
              key={d.toISOString()}
              className={`cal-week__day-head ${isTodayFn(d) ? "cal-week__day-head--today" : ""}`}
              onClick={() => onDateSelect(d)}
            >
              <span>{format(d, "EEE", { locale: es })}</span>
              <strong>{format(d, "d")}</strong>
            </div>
          ))}
        </div>
        <div className="cal-week__body">
          {HOUR_SLOTS.map((hour) => (
            <div key={hour} className="cal-week__row">
              <div className="cal-week__gutter">
                {String(hour).padStart(2, "0")}:00
              </div>
              {days.map((d) => {
                const slotEvents = getEventsForDay(d).filter((ev) => {
                  const h = parseISO(ev.start).getHours()
                  return h === hour
                })
                return (
                  <div
                    key={d.toISOString() + hour}
                    className="cal-week__cell"
                    onClick={() => {
                      onDateSelect(d)
                      onSlotClick?.(d, `${String(hour).padStart(2, "0")}:00`)
                    }}
                  >
                    {slotEvents.map((ev) => (
                      <button
                        key={ev.id}
                        type="button"
                        className="cal-event-bar cal-event-bar--week"
                        style={{ backgroundColor: getEventColor(ev) }}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (!ev.isBlocked) onEventClick(ev)
                        }}
                      >
                        {formatEventLabel(ev)}
                      </button>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ——— DAY VIEW ———
  const renderDay = () => {
    const dayEvents = getEventsForDay(currentDate)
    return (
      <div className="cal-day-view">
        {HOUR_SLOTS.map((hour) => {
          const slotEvents = dayEvents.filter(
            (ev) => parseISO(ev.start).getHours() === hour,
          )
          return (
            <div key={hour} className="cal-day-view__row">
              <div className="cal-day-view__time">
                {String(hour).padStart(2, "0")}:00
              </div>
              <div
                className="cal-day-view__slot"
                onClick={() =>
                  onSlotClick?.(
                    currentDate,
                    `${String(hour).padStart(2, "0")}:00`,
                  )
                }
              >
                {slotEvents.map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    className="cal-event-bar cal-event-bar--day"
                    style={{ backgroundColor: getEventColor(ev) }}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!ev.isBlocked) onEventClick(ev)
                    }}
                  >
                    <strong>
                      {format(parseISO(ev.start), "HH:mm")}
                      {ev.end
                        ? ` – ${format(parseISO(ev.end), "HH:mm")}`
                        : ""}
                    </strong>
                    <span>{formatEventLabel(ev)}</span>
                    {ev.optometristName && (
                      <small>{ev.optometristName}</small>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // ——— LIST VIEW ———
  const renderList = () => {
    const sorted = [...filteredEvents].sort(
      (a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime(),
    )
    if (sorted.length === 0) {
      return (
        <div className="cal-list-empty">
          No hay citas en el rango seleccionado.
        </div>
      )
    }
    return (
      <div className="cal-list">
        {sorted.map((ev) => (
          <button
            key={ev.id}
            type="button"
            className="cal-list__item"
            onClick={() => !ev.isBlocked && onEventClick(ev)}
          >
            <span
              className="cal-list__dot"
              style={{ backgroundColor: getEventColor(ev) }}
            />
            <div className="cal-list__when">
              <strong>{format(parseISO(ev.start), "EEE d MMM", { locale: es })}</strong>
              <span>
                {format(parseISO(ev.start), "HH:mm")}
                {ev.end ? ` – ${format(parseISO(ev.end), "HH:mm")}` : ""}
              </span>
            </div>
            <div className="cal-list__who">
              <strong>{formatEventLabel(ev)}</strong>
              {ev.optometristName && <small>{ev.optometristName}</small>}
            </div>
            <span
              className={`cal-list__status status--${ev.status}`}
            >
              {APPOINTMENT_STATUS_LABELS[ev.status] || ev.status}
            </span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="cal-root">
      {/* Toolbar */}
      <div className="cal-toolbar">
        <div className="cal-toolbar__nav">
          <button type="button" className="cal-btn cal-btn--icon" onClick={goPrev} aria-label="Anterior">
            <MuiSvgIcon size={18}>lucide:chevron-left</MuiSvgIcon>
          </button>
          <button type="button" className="cal-btn" onClick={goToday}>
            Today
          </button>
          <button type="button" className="cal-btn cal-btn--icon" onClick={goNext} aria-label="Siguiente">
            <MuiSvgIcon size={18}>lucide:chevron-right</MuiSvgIcon>
          </button>
          <h2 className="cal-toolbar__title">{title}</h2>
        </div>

        <div className="cal-toolbar__views">
          {(["month", "week", "day", "list"] as CalendarViewMode[]).map((m) => (
            <button
              key={m}
              type="button"
              className={`cal-btn cal-btn--segment ${viewMode === m ? "is-active" : ""}`}
              onClick={() => setViewMode(m)}
            >
              {m === "month" ? "Month" : m === "week" ? "Week" : m === "day" ? "Day" : "List"}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="cal-legend">
        <span className="cal-legend__item">
          <span className="cal-legend__swatch" style={{ background: "#3b82f6" }} />
          Programada
        </span>
        <span className="cal-legend__item">
          <span className="cal-legend__swatch" style={{ background: "#0ea5e9" }} />
          Confirmada
        </span>
        <span className="cal-legend__item">
          <span className="cal-legend__swatch" style={{ background: "#8b5cf6" }} />
          En consulta
        </span>
        <span className="cal-legend__item">
          <span className="cal-legend__swatch" style={{ background: "#10b981" }} />
          Completada
        </span>
        <span className="cal-legend__item">
          <span className="cal-legend__swatch" style={{ background: "#9ca3af" }} />
          Fuera de oficina / Bloqueo
        </span>
        <span className="cal-legend__item">
          <span className="cal-legend__swatch" style={{ background: "#64748b" }} />
          Anónimo
        </span>
      </div>

      {/* Body */}
      <div className="cal-body">
        {viewMode === "month" && renderMonth()}
        {viewMode === "week" && renderWeek()}
        {viewMode === "day" && renderDay()}
        {viewMode === "list" && renderList()}
      </div>
    </div>
  )
}
