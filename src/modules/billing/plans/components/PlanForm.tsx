import { useState } from "react"
import type { Plan } from "../types/plans.types"

interface PlanFormProps {
  onSubmit: (data: any) => void
  initialData?: Plan | null
  onCancel: () => void
  isEditing: boolean
  isSubmitting?: boolean
}

const BILLING_CYCLES = [
  { value: 'monthly', label: 'Mensual' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'semiannual', label: 'Semestral' },
  { value: 'annual', label: 'Anual' }
]

export const PlanForm = ({ 
  onSubmit, 
  initialData, 
  onCancel, 
  isEditing,
  isSubmitting 
}: PlanFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    code: initialData?.code || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    billing_cycle: initialData?.billing_cycle || 'monthly',
    status: initialData?.status ?? true,
    is_public: initialData?.is_public ?? true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del plan es requerido'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'El código del plan es requerido'
    } else if (!/^[a-z0-9_-]+$/.test(formData.code)) {
      newErrors.code = 'Solo letras minúsculas, números, guiones y guiones bajos'
    }

    if (!formData.price) {
      newErrors.price = 'El precio es requerido'
    } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = 'Ingrese un precio válido'
    }

    if (!formData.billing_cycle) {
      newErrors.billing_cycle = 'Seleccione un ciclo de facturación'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    const submitData = {
      ...formData,
      price: String(Number(formData.price).toFixed(2))
    }

    onSubmit(submitData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="plan-form">
      <div className="plan-form__section">
        <div className="plan-form__row">
          <div className="plan-form__field">
            <label htmlFor="name">Nombre del Plan *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Plan Premium"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="plan-form__error">{errors.name}</span>}
          </div>

          <div className="plan-form__field">
            <label htmlFor="code">Código *</label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="premium"
              className={errors.code ? 'error' : ''}
            />
            {errors.code && <span className="plan-form__error">{errors.code}</span>}
            <p className="plan-form__helper">Identificador único para el plan (ej: basic, pro, enterprise)</p>
          </div>
        </div>

        <div className="plan-form__row">
          <div className="plan-form__field">
            <label htmlFor="price">Precio *</label>
            <div className="plan-form__price-input">
              <span className="plan-form__currency">S/</span>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={errors.price ? 'error' : ''}
              />
            </div>
            {errors.price && <span className="plan-form__error">{errors.price}</span>}
          </div>

          <div className="plan-form__field">
            <label htmlFor="billing_cycle">Ciclo de Facturación *</label>
            <select
              id="billing_cycle"
              name="billing_cycle"
              value={formData.billing_cycle}
              onChange={handleChange}
              className={errors.billing_cycle ? 'error' : ''}
            >
              {BILLING_CYCLES.map(cycle => (
                <option key={cycle.value} value={cycle.value}>
                  {cycle.label}
                </option>
              ))}
            </select>
            {errors.billing_cycle && <span className="plan-form__error">{errors.billing_cycle}</span>}
          </div>
        </div>

        <div className="plan-form__field">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe las características y beneficios del plan..."
          />
        </div>
      </div>

      <div className="plan-form__section">
        <h4 className="plan-form__section-title">Configuración</h4>
        
        <div className="plan-form__row">
          <div className="plan-form__field plan-form__field--checkbox">
            <label className="plan-form__checkbox">
              <input
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
              />
              <span>Plan Activo</span>
            </label>
            <p className="plan-form__helper">
              Los planes inactivos no estarán disponibles para nuevos suscriptores
            </p>
          </div>

          <div className="plan-form__field plan-form__field--checkbox">
            <label className="plan-form__checkbox">
              <input
                type="checkbox"
                name="is_public"
                checked={formData.is_public}
                onChange={handleChange}
              />
              <span>Plan Público</span>
            </label>
            <p className="plan-form__helper">
              Los planes privados solo son visibles para administradores
            </p>
          </div>
        </div>
      </div>

      <div className="plan-form__actions">
        <button 
          type="button" 
          className="plan-form__cancel" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className="plan-form__submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="plan-form__spinner"></span>
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