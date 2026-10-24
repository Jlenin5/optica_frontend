import type { MedicalRecord } from "../types/medical_records.types"
import MuiSvgIcon from "@/components/MuiSvgIcon"

interface MedicalRecordDetailProps {
  medicalRecord: MedicalRecord
  onEdit?: () => void
}

export const MedicalRecordDetail = ({ medicalRecord, onEdit }: MedicalRecordDetailProps) => {
  return (
    <div className="medical-record-detail">
      <div className="medical-record-detail__header">
        <h3 className="medical-record-detail__title">
          <MuiSvgIcon size={20}>lucide:heart-pulse</MuiSvgIcon>
          Historial Clínico
        </h3>
        {onEdit && (
          <button className="medical-record-detail__edit-btn" onClick={onEdit}>
            <MuiSvgIcon size={16}>heroicons-outline:pencil-square</MuiSvgIcon>
            Editar
          </button>
        )}
      </div>

      <div className="medical-record-detail__grid">
        <div className="medical-record-detail__field">
          <label>Tipo de Sangre</label>
          <p>{medicalRecord.blood_type || "No registrado"}</p>
        </div>

        <div className="medical-record-detail__field">
          <label>Alergias</label>
          <p>{medicalRecord.allergies || "Ninguna registrada"}</p>
        </div>

        <div className="medical-record-detail__field">
          <label>Condiciones Crónicas</label>
          <p>{medicalRecord.chronic_conditions || "Ninguna registrada"}</p>
        </div>

        <div className="medical-record-detail__field">
          <label>Antecedentes Familiares</label>
          <p>{medicalRecord.family_history || "No especificado"}</p>
        </div>

        <div className="medical-record-detail__field medical-record-detail__field--full">
          <label>Observaciones Generales</label>
          <p>{medicalRecord.general_observations || "Sin observaciones"}</p>
        </div>

        {medicalRecord.consultations_count !== undefined && (
          <div className="medical-record-detail__field">
            <label>Consultas Registradas</label>
            <p>{medicalRecord.consultations_count}</p>
          </div>
        )}
      </div>
    </div>
  )
}
