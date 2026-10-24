import type { Prescription } from "../types/prescriptions.types"
import MuiSvgIcon from '@/components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"
import "@styles/prescription-view.scss"

interface PrescriptionViewProps {
  prescription: Prescription
  onEdit: () => void
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es })
}

const formatValue = (value: number | string | null) => {
  if (value === null || value === undefined) return '-'
  return Number(value).toFixed(2)
}

export const PrescriptionView = ({ prescription, onEdit }: PrescriptionViewProps) => {
  return (
    <div className="prescription-view">
      <div className="prescription-view__header">
        <h3 className="prescription-view__title">
          <MuiSvgIcon size={20}>lucide:file-text</MuiSvgIcon>
          Detalles de la Prescripción
        </h3>
        <button className="prescription-view__edit-btn" onClick={onEdit}>
          <MuiSvgIcon size={18}>
            heroicons-outline:pencil-square
          </MuiSvgIcon>
          Editar
        </button>
      </div>

      <div className="prescription-view__content">
        <div className="prescription-view__section">
          <h4 className="prescription-view__section-title">Ojo Derecho (OD)</h4>
          <div className="prescription-view__row">
            <div className="prescription-view__item">
              <span className="prescription-view__label">Esfera</span>
              <span className="prescription-view__value">
                {formatValue(prescription.sphere_od)}
              </span>
            </div>
            <div className="prescription-view__item">
              <span className="prescription-view__label">Cilindro</span>
              <span className="prescription-view__value">
                {formatValue(prescription.cylinder_od)}
              </span>
            </div>
          </div>
        </div>

        <div className="prescription-view__section">
          <h4 className="prescription-view__section-title">Ojo Izquierdo (OI)</h4>
          <div className="prescription-view__row">
            <div className="prescription-view__item">
              <span className="prescription-view__label">Esfera</span>
              <span className="prescription-view__value">
                {formatValue(prescription.sphere_oi)}
              </span>
            </div>
            <div className="prescription-view__item">
              <span className="prescription-view__label">Cilindro</span>
              <span className="prescription-view__value">
                {formatValue(prescription.cylinder_oi)}
              </span>
            </div>
          </div>
        </div>

        {prescription.notes && (
          <div className="prescription-view__section">
            <h4 className="prescription-view__section-title">Notas</h4>
            <p className="prescription-view__notes">
              {prescription.notes}
            </p>
          </div>
        )}

        <div className="prescription-view__footer">
          <div className="prescription-view__meta">
            <span className="prescription-view__status">
              Estado: 
              <span className={`prescription-view__status-badge ${prescription.status ? 'prescription-view__status-badge--active' : 'prescription-view__status-badge--inactive'}`}>
                {prescription.status ? 'Activa' : 'Inactiva'}
              </span>
            </span>
            <span className="prescription-view__date">
              Creada: {formatDate(prescription.created_at)}
            </span>
            {prescription.created_by_id && (
              <span className="prescription-view__author">
                Por: {prescription.created_by_id}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}