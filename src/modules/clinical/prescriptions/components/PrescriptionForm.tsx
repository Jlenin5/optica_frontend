import { useState, useEffect } from "react"
import type { Prescription } from "../types/prescriptions.types"
import MuiSvgIcon from '@/components/MuiSvgIcon'

interface PrescriptionFormProps {
  initialData?: Prescription | null
  onSubmit: (data: any) => void
  onCancel: () => void
  isSubmitting?: boolean
  consultationId?: number
  patientId?: number
  fixedSourceType?: "INTERNAL" | "EXTERNAL"
}

export const PrescriptionForm = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting,
  consultationId,
  patientId,
  fixedSourceType
}: PrescriptionFormProps) => {
  
  const [formData, setFormData] = useState({
    sphere_od: "",
    cylinder_od: "",
    sphere_oi: "",
    cylinder_oi: "",
    notes: "",
    status: true,
    source_type: fixedSourceType || initialData?.source_type || "INTERNAL",
    expires_at: initialData?.expires_at || "",
    prescription_date: initialData?.prescription_date || new Date().toISOString().slice(0,10),
    axis_od: initialData?.axis_od?.toString() || "",
    addition_od: initialData?.addition_od?.toString() || "",
    axis_oi: initialData?.axis_oi?.toString() || "",
    addition_oi: initialData?.addition_oi?.toString() || "",
    pd: initialData?.pd?.toString() || "",
    pd_od: initialData?.pd_od?.toString() || "",
    pd_oi: initialData?.pd_oi?.toString() || ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        sphere_od: initialData.sphere_od?.toString() || "",
        cylinder_od: initialData.cylinder_od?.toString() || "",
        sphere_oi: initialData.sphere_oi?.toString() || "",
        cylinder_oi: initialData.cylinder_oi?.toString() || "",
        notes: initialData.notes || "",
        status: initialData.status !== undefined ? initialData.status : true,
        source_type: fixedSourceType || initialData.source_type || "INTERNAL",
        expires_at: initialData.expires_at || "",
        prescription_date: initialData.prescription_date || new Date().toISOString().slice(0,10),
        axis_od: initialData.axis_od?.toString() || "", addition_od: initialData.addition_od?.toString() || "", axis_oi: initialData.axis_oi?.toString() || "", addition_oi: initialData.addition_oi?.toString() || "", pd: initialData.pd?.toString() || "", pd_od: initialData.pd_od?.toString() || "", pd_oi: initialData.pd_oi?.toString() || ""
      })
    }
  }, [initialData, fixedSourceType])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    // Validar esfera OD
    if (formData.sphere_od && isNaN(Number(formData.sphere_od))) {
      newErrors.sphere_od = "Ingrese un valor numérico válido"
    } else if (formData.sphere_od && (Number(formData.sphere_od) < -20 || Number(formData.sphere_od) > 20)) {
      newErrors.sphere_od = "La esfera debe estar entre -20 y +20"
    }
    
    // Validar cilindro OD
    if (formData.cylinder_od && isNaN(Number(formData.cylinder_od))) {
      newErrors.cylinder_od = "Ingrese un valor numérico válido"
    } else if (formData.cylinder_od && (Number(formData.cylinder_od) < -10 || Number(formData.cylinder_od) > 10)) {
      newErrors.cylinder_od = "El cilindro debe estar entre -10 y +10"
    }
    
    // Validar esfera OI
    if (formData.sphere_oi && isNaN(Number(formData.sphere_oi))) {
      newErrors.sphere_oi = "Ingrese un valor numérico válido"
    } else if (formData.sphere_oi && (Number(formData.sphere_oi) < -20 || Number(formData.sphere_oi) > 20)) {
      newErrors.sphere_oi = "La esfera debe estar entre -20 y +20"
    }
    
    // Validar cilindro OI
    if (formData.cylinder_oi && isNaN(Number(formData.cylinder_oi))) {
      newErrors.cylinder_oi = "Ingrese un valor numérico válido"
    } else if (formData.cylinder_oi && (Number(formData.cylinder_oi) < -10 || Number(formData.cylinder_oi) > 10)) {
      newErrors.cylinder_oi = "El cilindro debe estar entre -10 y +10"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    const submitData = {
      patient_id: patientId || initialData?.patient_id!,
      consultation_id: formData.source_type === "INTERNAL" ? consultationId || initialData?.consultation_id || null : null,
      source_type: formData.source_type as "INTERNAL" | "EXTERNAL",
      prescription_date: formData.prescription_date || undefined,
      expires_at: formData.expires_at || null,
      sphere_od: formData.sphere_od ? parseFloat(formData.sphere_od) : null,
      cylinder_od: formData.cylinder_od ? parseFloat(formData.cylinder_od) : null,
      sphere_oi: formData.sphere_oi ? parseFloat(formData.sphere_oi) : null,
      cylinder_oi: formData.cylinder_oi ? parseFloat(formData.cylinder_oi) : null,
      axis_od: formData.axis_od ? parseInt(formData.axis_od) : null,
      addition_od: formData.addition_od ? parseFloat(formData.addition_od) : null,
      axis_oi: formData.axis_oi ? parseInt(formData.axis_oi) : null,
      addition_oi: formData.addition_oi ? parseFloat(formData.addition_oi) : null,
      pd: formData.pd ? parseFloat(formData.pd) : null,
      pd_od: formData.pd_od ? parseFloat(formData.pd_od) : null,
      pd_oi: formData.pd_oi ? parseFloat(formData.pd_oi) : null,
      notes: formData.notes || null,
      status: formData.status
    }
    
    onSubmit(submitData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <form className="prescription-form" onSubmit={handleSubmit}>
      <div className="prescription-form__section">
        <h3 className="prescription-form__section-title">Información de la receta</h3>
        <div className="prescription-form__row">
          <div className="prescription-form__field"><label>Origen</label><select name="source_type" value={formData.source_type} onChange={handleChange} disabled={!!fixedSourceType}><option value="INTERNAL">Consulta interna</option><option value="EXTERNAL">Receta externa</option></select></div>
          <div className="prescription-form__field"><label>Fecha de receta</label><input type="date" name="prescription_date" value={formData.prescription_date} onChange={handleChange}/></div>
          <div className="prescription-form__field"><label>Vence</label><input type="date" name="expires_at" value={formData.expires_at} onChange={handleChange}/></div>
        </div>
      </div>
      <div className="prescription-form__section">
        <h3 className="prescription-form__section-title">
          <MuiSvgIcon size={20}>lucide:eye</MuiSvgIcon>
          Ojo Derecho (OD)
        </h3>
        <div className="prescription-form__row">
          <div className="prescription-form__field">
            <label>Esfera</label>
            <input
              type="number"
              name="sphere_od"
              step="0.25"
              placeholder="0.00"
              value={formData.sphere_od}
              onChange={handleChange}
              className={errors.sphere_od ? 'error' : ''}
            />
            {errors.sphere_od && <span className="prescription-form__error">{errors.sphere_od}</span>}
          </div>
          <div className="prescription-form__field">
            <label>Cilindro</label>
            <input
              type="number"
              name="cylinder_od"
              step="0.25"
              placeholder="0.00"
              value={formData.cylinder_od}
              onChange={handleChange}
              className={errors.cylinder_od ? 'error' : ''}
            />
            {errors.cylinder_od && <span className="prescription-form__error">{errors.cylinder_od}</span>}
          </div>
        </div>
      </div>

      <div className="prescription-form__section">
        <h3 className="prescription-form__section-title">
          <MuiSvgIcon size={20}>lucide:eye</MuiSvgIcon>
          Ojo Izquierdo (OI)
        </h3>
        <div className="prescription-form__row">
          <div className="prescription-form__field">
            <label>Esfera</label>
            <input
              type="number"
              name="sphere_oi"
              step="0.25"
              placeholder="0.00"
              value={formData.sphere_oi}
              onChange={handleChange}
              className={errors.sphere_oi ? 'error' : ''}
            />
            {errors.sphere_oi && <span className="prescription-form__error">{errors.sphere_oi}</span>}
          </div>
          <div className="prescription-form__field">
            <label>Cilindro</label>
            <input
              type="number"
              name="cylinder_oi"
              step="0.25"
              placeholder="0.00"
              value={formData.cylinder_oi}
              onChange={handleChange}
              className={errors.cylinder_oi ? 'error' : ''}
            />
            {errors.cylinder_oi && <span className="prescription-form__error">{errors.cylinder_oi}</span>}
          </div>
        </div>
      </div>

      <div className="prescription-form__section"><h3 className="prescription-form__section-title">Medidas adicionales</h3><div className="prescription-form__row">{['axis_od','addition_od','axis_oi','addition_oi','pd','pd_od','pd_oi'].map(name=><div className="prescription-form__field" key={name}><label>{name.toUpperCase().replaceAll('_',' ')}</label><input type="number" step="0.01" min={name.startsWith('axis')?'0':'0'} max={name.startsWith('axis')?'180':undefined} name={name} value={(formData as any)[name]} onChange={handleChange}/></div>)}</div></div>

      <div className="prescription-form__section">
        <h3 className="prescription-form__section-title">
          <MuiSvgIcon size={20}>lucide:file-text</MuiSvgIcon>
          Información Adicional
        </h3>
        
        <div className="prescription-form__field">
          <label>Notas</label>
          <textarea
            name="notes"
            rows={4}
            placeholder="Observaciones adicionales..."
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <div className="prescription-form__field prescription-form__field--checkbox">
          <label className="prescription-form__checkbox-label">
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
            />
            <span>Prescripción activa</span>
          </label>
        </div>
      </div>

      <div className="prescription-form__actions">
        <button
          type="button"
          className="prescription-form__btn prescription-form__btn--secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="prescription-form__btn prescription-form__btn--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="prescription-form__spinner"></span>
              Guardando...
            </>
          ) : (
            'Guardar'
          )}
        </button>
      </div>
    </form>
  )
}