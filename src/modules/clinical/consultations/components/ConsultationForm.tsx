import { useState, useEffect } from "react"
import type { Consultation, ConsultationFormData } from "../types/consultations.types"
import MuiSvgIcon from "@/components/MuiSvgIcon"

interface ConsultationFormProps {
  initialData?: Consultation | null
  onSubmit: (data: ConsultationFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
  medicalRecordId: number
  appointmentId?: number | null
  optometristId?: number | null
}

export const ConsultationForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  medicalRecordId,
  appointmentId,
  optometristId
}: ConsultationFormProps) => {
  const [formData, setFormData] = useState({
    chief_complaint: "",
    diagnosis: "",
    observations: "",
    recommendations: "",
    visual_acuity_od: "",
    visual_acuity_oi: "",
    intraocular_pressure_od: "",
    intraocular_pressure_oi: "",
    status: 'draft'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        chief_complaint: initialData.chief_complaint || "",
        diagnosis: initialData.diagnosis || "",
        observations: initialData.observations || "",
        recommendations: initialData.recommendations || "",
        visual_acuity_od: initialData.visual_acuity_od || "",
        visual_acuity_oi: initialData.visual_acuity_oi || "",
        intraocular_pressure_od: initialData.intraocular_pressure_od || "",
        intraocular_pressure_oi: initialData.intraocular_pressure_oi || "",
        status: initialData.status !== undefined ? initialData.status : 'draft'
      })
    }
  }, [initialData])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.chief_complaint.trim()) {
      newErrors.chief_complaint = "El motivo de consulta es requerido"
    }

    if (formData.visual_acuity_od && formData.visual_acuity_od.length > 20) {
      newErrors.visual_acuity_od = "Máximo 20 caracteres"
    }

    if (formData.visual_acuity_oi && formData.visual_acuity_oi.length > 20) {
      newErrors.visual_acuity_oi = "Máximo 20 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    const submitData: ConsultationFormData = {
      medical_record_id: medicalRecordId,
      appointment: appointmentId || null,
      optometrist: optometristId || null,
      chief_complaint: formData.chief_complaint,
      diagnosis: formData.diagnosis || null,
      observations: formData.observations || null,
      recommendations: formData.recommendations || null,
      visual_acuity_od: formData.visual_acuity_od || null,
      visual_acuity_oi: formData.visual_acuity_oi || null,
      intraocular_pressure_od: formData.intraocular_pressure_od || null,
      intraocular_pressure_oi: formData.intraocular_pressure_oi || null,
      status: formData.status
    }

    onSubmit(submitData)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <form className="evaluation-form" onSubmit={handleSubmit}>
      {/* Motivo de Consulta */}
      <div className="evaluation-form__section">
        <h3 className="evaluation-form__section-title">
          <MuiSvgIcon size={20}>lucide:stethoscope</MuiSvgIcon>
          Información Principal
        </h3>

        <div className="evaluation-form__field">
          <label>
            Motivo de Consulta <span className="required">*</span>
          </label>
          <textarea
            name="chief_complaint"
            rows={3}
            placeholder="Describa el motivo de la consulta..."
            value={formData.chief_complaint}
            onChange={handleChange}
            className={errors.chief_complaint ? "error" : ""}
          />
          {errors.chief_complaint && (
            <span className="evaluation-form__error">
              {errors.chief_complaint}
            </span>
          )}
        </div>

        <div className="evaluation-form__field">
          <label>Diagnóstico</label>
          <textarea
            name="diagnosis"
            rows={3}
            placeholder="Diagnóstico del paciente..."
            value={formData.diagnosis}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Agudeza Visual */}
      <div className="evaluation-form__section">
        <h3 className="evaluation-form__section-title">
          <MuiSvgIcon size={20}>lucide:eye</MuiSvgIcon>
          Agudeza Visual
        </h3>
        <div className="evaluation-form__row">
          <div className="evaluation-form__field">
            <label>Ojo Derecho (OD)</label>
            <input
              type="text"
              name="visual_acuity_od"
              placeholder="Ej: 20/20"
              value={formData.visual_acuity_od}
              onChange={handleChange}
              maxLength={20}
              className={errors.visual_acuity_od ? "error" : ""}
            />
            {errors.visual_acuity_od && (
              <span className="evaluation-form__error">
                {errors.visual_acuity_od}
              </span>
            )}
          </div>
          <div className="evaluation-form__field">
            <label>Ojo Izquierdo (OI)</label>
            <input
              type="text"
              name="visual_acuity_oi"
              placeholder="Ej: 20/20"
              value={formData.visual_acuity_oi}
              onChange={handleChange}
              maxLength={20}
              className={errors.visual_acuity_oi ? "error" : ""}
            />
            {errors.visual_acuity_oi && (
              <span className="evaluation-form__error">
                {errors.visual_acuity_oi}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Presión Intraocular */}
      <div className="evaluation-form__section">
        <h3 className="evaluation-form__section-title">
          <MuiSvgIcon size={20}>lucide:gauge</MuiSvgIcon>
          Presión Intraocular
        </h3>
        <div className="evaluation-form__row">
          <div className="evaluation-form__field">
            <label>Ojo Derecho (OD)</label>
            <input
              type="text"
              name="intraocular_pressure_od"
              placeholder="Ej: 15 mmHg"
              value={formData.intraocular_pressure_od}
              onChange={handleChange}
            />
          </div>
          <div className="evaluation-form__field">
            <label>Ojo Izquierdo (OI)</label>
            <input
              type="text"
              name="intraocular_pressure_oi"
              placeholder="Ej: 15 mmHg"
              value={formData.intraocular_pressure_oi}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Observaciones y Recomendaciones */}
      <div className="evaluation-form__section">
        <h3 className="evaluation-form__section-title">
          <MuiSvgIcon size={20}>lucide:clipboard-list</MuiSvgIcon>
          Información Adicional
        </h3>

        <div className="evaluation-form__field">
          <label>Observaciones</label>
          <textarea
            name="observations"
            rows={3}
            placeholder="Observaciones adicionales..."
            value={formData.observations}
            onChange={handleChange}
          />
        </div>

        <div className="evaluation-form__field">
          <label>Recomendaciones</label>
          <textarea
            name="recommendations"
            rows={3}
            placeholder="Recomendaciones para el paciente..."
            value={formData.recommendations}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Acciones */}
      <div className="evaluation-form__actions">
        <button
          type="button"
          className="evaluation-form__btn evaluation-form__btn--secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="evaluation-form__btn evaluation-form__btn--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="evaluation-form__spinner"></span>
              Guardando...
            </>
          ) : (
            "Guardar Consulta"
          )}
        </button>
      </div>
    </form>
  )
}
