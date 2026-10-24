import type { Prescription } from "../types/prescriptions.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"
import "@styles/prescription-list.scss"

interface PrescriptionListProps {
  prescriptions: Prescription[]
  onView?: (prescription: Prescription) => void
  onEdit?: (prescription: Prescription) => void
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy", { locale: es })
}

export const PrescriptionList = ({ prescriptions, onView, onEdit }: PrescriptionListProps) => {
  if (prescriptions.length === 0) {
    return (
      <div className="prescription-list__empty">
        <MuiSvgIcon size={32}>lucide:file-text</MuiSvgIcon>
        <p>No hay recetas registradas</p>
      </div>
    )
  }

  return (
    <div className="prescription-list">
      {prescriptions.map((prescription) => (
        <div key={prescription.id} className="prescription-list__item">
          <div className="prescription-list__item-header">
            <div className="prescription-list__item-date">
              <MuiSvgIcon size={16}>lucide:calendar</MuiSvgIcon>
              {formatDate(prescription.created_at)}
            </div>
            <div className="prescription-list__item-badges">
              {prescription.consultation?.appointment && (
                <span className="prescription-list__badge prescription-list__badge--appointment">
                  De cita
                </span>
              )}
              <span className={`prescription-list__badge ${prescription.status ? 'prescription-list__badge--active' : 'prescription-list__badge--inactive'}`}>
                {prescription.status ? 'Activa' : 'Inactiva'}
              </span>
            </div>
          </div>
          
          <div className="prescription-list__item-content">
            <div className="prescription-list__prescription-data">
              <div className="prescription-list__eye">
                <strong>OD:</strong> {prescription.sphere_od || 0} / {prescription.cylinder_od || 0}
              </div>
              <div className="prescription-list__eye">
                <strong>OI:</strong> {prescription.sphere_oi || 0} / {prescription.cylinder_oi || 0}
              </div>
            </div>
            {prescription.notes && (
              <div className="prescription-list__notes">{prescription.notes}</div>
            )}
          </div>
          
          <div className="prescription-list__item-actions">
            {onView && (
              <button onClick={() => onView(prescription)} title="Ver detalles">
                <MuiSvgIcon size={18}>lucide:eye</MuiSvgIcon>
              </button>
            )}
            {onEdit && (
              <button onClick={() => onEdit(prescription)} title="Editar">
                <MuiSvgIcon size={18}>
                  heroicons-outline:pencil-square
                </MuiSvgIcon>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}