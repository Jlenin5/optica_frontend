import { useState, useEffect } from "react"
import type { MedicalRecord, MedicalRecordFormData } from "../types/medical_records.types"
import MuiSvgIcon from "@/components/MuiSvgIcon"

interface MedicalRecordFormProps {
  initialData?: MedicalRecord | null
  onSubmit: (data: MedicalRecordFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export const MedicalRecordForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting
}: MedicalRecordFormProps) => {
  const [formData, setFormData] = useState<MedicalRecordFormData>({
    blood_type: "",
    allergies: "",
    chronic_conditions: "",
    family_history: "",
    general_observations: ""
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        blood_type: initialData.blood_type || "",
        allergies: initialData.allergies || "",
        chronic_conditions: initialData.chronic_conditions || "",
        family_history: initialData.family_history || "",
        general_observations: initialData.general_observations || ""
      })
    }
  }, [initialData])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      blood_type: formData.blood_type || null,
      allergies: formData.allergies || null,
      chronic_conditions: formData.chronic_conditions || null,
      family_history: formData.family_history || null,
      general_observations: formData.general_observations || null
    })
  }

  return (
    <form className="medical-record-form" onSubmit={handleSubmit}>
      <div className="medical-record-form__section">
        <h3 className="medical-record-form__section-title">
          <MuiSvgIcon size={20}>lucide:heart-pulse</MuiSvgIcon>
          Información General
        </h3>

        <div className="medical-record-form__field">
          <label>Tipo de Sangre</label>
          <input
            type="text"
            name="blood_type"
            placeholder="Ej: O+"
            value={formData.blood_type || ""}
            onChange={handleChange}
            maxLength={5}
          />
        </div>

        <div className="medical-record-form__field">
          <label>Alergias</label>
          <textarea
            name="allergies"
            rows={3}
            placeholder="Alergias conocidas del paciente..."
            value={formData.allergies || ""}
            onChange={handleChange}
          />
        </div>

        <div className="medical-record-form__field">
          <label>Condiciones Crónicas</label>
          <textarea
            name="chronic_conditions"
            rows={3}
            placeholder="Diabetes, hipertensión, etc..."
            value={formData.chronic_conditions || ""}
            onChange={handleChange}
          />
        </div>

        <div className="medical-record-form__field">
          <label>Antecedentes Familiares</label>
          <textarea
            name="family_history"
            rows={3}
            placeholder="Antecedentes oftalmológicos familiares..."
            value={formData.family_history || ""}
            onChange={handleChange}
          />
        </div>

        <div className="medical-record-form__field">
          <label>Observaciones Generales</label>
          <textarea
            name="general_observations"
            rows={3}
            placeholder="Otras observaciones relevantes..."
            value={formData.general_observations || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="medical-record-form__actions">
        <button
          type="button"
          className="medical-record-form__btn medical-record-form__btn--secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="medical-record-form__btn medical-record-form__btn--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="medical-record-form__spinner"></span>
              Guardando...
            </>
          ) : (
            "Guardar Historial Clínico"
          )}
        </button>
      </div>
    </form>
  )
}
