import { useState, useEffect } from "react"
import type { Tax } from "../types/taxes.types"

interface TaxFormProps {
  onSubmit: (data: any) => void
  initialData?: Tax | null
  onCancel: () => void
  isEditing: boolean
  isSubmitting?: boolean
}

export const TaxForm = ({ 
  onSubmit, 
  initialData, 
  onCancel, 
  isEditing,
  isSubmitting 
}: TaxFormProps) => {
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    percent: "",
    account: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || "",
        description: initialData.description || "",
        percent: initialData.percent?.toString() || "",
        account: initialData.account || "",
      })
    }
  }, [initialData])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.code.trim()) {
      newErrors.code = "El código es requerido"
    } else if (!/^[A-Z0-9_]+$/.test(formData.code)) {
      newErrors.code = "Solo letras mayúsculas, números y guiones bajos"
    }
    
    if (!formData.percent) {
      newErrors.percent = "El porcentaje es requerido"
    } else {
      const percent = parseFloat(formData.percent)
      if (isNaN(percent)) {
        newErrors.percent = "Ingrese un valor numérico válido"
      } else if (percent < 0) {
        newErrors.percent = "El porcentaje no puede ser negativo"
      } else if (percent > 100) {
        newErrors.percent = "El porcentaje no puede exceder 100%"
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    const submitData = {
      code: formData.code.toUpperCase(),
      description: formData.description,
      percent: parseFloat(formData.percent),
      account: formData.account || null,
    }
    
    onSubmit(submitData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <form className="tax-form" onSubmit={handleSubmit}>
      <div className="tax-form__section">
        <div className="tax-form__row">
          <div className="tax-form__field">
            <label className="tax-form__label">
              Código <span className="tax-form__required">*</span>
            </label>
            <input
              type="text"
              name="code"
              placeholder="IGV"
              className={`tax-form__input ${errors.code ? 'tax-form__input--error' : ''}`}
              value={formData.code}
              onChange={handleChange}
            />
            {errors.code && <span className="tax-form__error">{errors.code}</span>}
            <p className="tax-form__helper">Código único del impuesto (ej: IGV, ISC, IR)</p>
          </div>

          <div className="tax-form__field">
            <label className="tax-form__label">
              Porcentaje <span className="tax-form__required">*</span>
            </label>
            <div className="tax-form__percent-input">
              <input
                type="number"
                name="percent"
                step="0.01"
                placeholder="18.00"
                className={`tax-form__input ${errors.percent ? 'tax-form__input--error' : ''}`}
                value={formData.percent}
                onChange={handleChange}
              />
              <span className="tax-form__percent-symbol">%</span>
            </div>
            {errors.percent && <span className="tax-form__error">{errors.percent}</span>}
          </div>
        </div>

        <div className="tax-form__row">
          <div className="tax-form__field">
            <label className="tax-form__label">Cuenta Contable</label>
            <input
              type="text"
              name="account"
              placeholder="4011"
              className="tax-form__input"
              value={formData.account}
              onChange={handleChange}
            />
            <p className="tax-form__helper">Número de cuenta contable asociada (opcional)</p>
          </div>
        </div>

        <div className="tax-form__field">
          <label className="tax-form__label">
            Descripción
          </label>
          <input
            type='text'
            name="description"
            className={`tax-form__textarea ${errors.description ? 'tax-form__textarea--error' : ''}`}
            value={formData.description}
            onChange={handleChange}
            placeholder="Descripción del impuesto..."
          />
          {errors.description && <span className="tax-form__error">{errors.description}</span>}
        </div>
      </div>

      <div className="tax-form__actions">
        <button
          type="button"
          className="tax-form__button tax-form__button--secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="tax-form__button tax-form__button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="tax-form__spinner"></span>
              {isEditing ? 'Actualizando...' : 'Creando...'}
            </>
          ) : (
            'Guardar'
          )}
        </button>
      </div>
    </form>
  )
}