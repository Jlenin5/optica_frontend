import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface AppointmentSummaryProps {
  summary: {
    patient: string
    document: string
    phone: string
    date: string
    time: string
    optometrist?: string
    notes?: string
  } | null
}

const formatDate = (date: string) => {
  return format(new Date(date), "EEEE, d 'de' MMMM yyyy", { locale: es })
}

export const AppointmentSummary = ({ summary }: AppointmentSummaryProps) => {
  if (!summary) return null

  return (
    <div className="appointment-summary">
      <div className="appointment-summary__section">
        <h3 className="appointment-summary__title">
          <MuiSvgIcon size={20}>lucide:user</MuiSvgIcon>
          Información del Paciente
        </h3>
        <div className="appointment-summary__grid">
          <div className="appointment-summary__item">
            <span className="appointment-summary__label">Nombre completo</span>
            <span className="appointment-summary__value">{summary.patient}</span>
          </div>
          <div className="appointment-summary__item">
            <span className="appointment-summary__label">Documento</span>
            <span className="appointment-summary__value">{summary.document}</span>
          </div>
          <div className="appointment-summary__item">
            <span className="appointment-summary__label">Teléfono</span>
            <span className="appointment-summary__value">{summary.phone}</span>
          </div>
        </div>
      </div>

      <div className="appointment-summary__section">
        <h3 className="appointment-summary__title">
          <MuiSvgIcon size={20}>lucide:calendar-clock</MuiSvgIcon>
          Detalles de la Cita
        </h3>
        <div className="appointment-summary__grid">
          <div className="appointment-summary__item">
            <span className="appointment-summary__label">Fecha</span>
            <span className="appointment-summary__value">{formatDate(summary.date)}</span>
          </div>
          <div className="appointment-summary__item">
            <span className="appointment-summary__label">Hora</span>
            <span className="appointment-summary__value">{summary.time}</span>
          </div>
          {summary.optometrist && (
            <div className="appointment-summary__item">
              <span className="appointment-summary__label">Optometrista</span>
              <span className="appointment-summary__value">{summary.optometrist}</span>
            </div>
          )}
        </div>
      </div>

      {summary.notes && (
        <div className="appointment-summary__section">
          <h3 className="appointment-summary__title">
            <MuiSvgIcon size={20}>lucide:file-text</MuiSvgIcon>
            Notas
          </h3>
          <div className="appointment-summary__notes">
            {summary.notes}
          </div>
        </div>
      )}

      <div className="appointment-summary__warning">
        <MuiSvgIcon size={20}>lucide:info</MuiSvgIcon>
        <span>
          Por favor, verifica que todos los datos sean correctos antes de confirmar la cita.
        </span>
      </div>
    </div>
  )
}