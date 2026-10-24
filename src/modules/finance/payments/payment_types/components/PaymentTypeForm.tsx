import { useState, useEffect } from "react"
import type { CreatePaymentTypeDTO } from "../types/payment-types.types"

interface PaymentTypeFormProps {
  onSubmit: (data: CreatePaymentTypeDTO) => void
  initialData?: CreatePaymentTypeDTO | null
  onCancel: () => void
  isEditing: boolean
  isSubmitting?: boolean
}

export const PaymentTypeForm = ({ 
  onSubmit, 
  initialData, 
  onCancel, 
  isEditing,
  isSubmitting 
}: PaymentTypeFormProps) => {
  const [formData, setFormData] = useState({
    description: "",
    has_financing: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        description: initialData.description || "",
        has_financing: initialData.has_financing || false,
      })
    }
  }, [initialData])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.description.trim()) {
      newErrors.description = "La descripción es requerida"
    } else if (formData.description.length < 3) {
      newErrors.description = "La descripción debe tener al menos 3 caracteres"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    const submitData = {
      id: null,
      description: formData.description,
      has_financing: formData.has_financing,
    }
    
    onSubmit(submitData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
    <form className="payment-type-form" onSubmit={handleSubmit}>
      <div className="payment-type-form__section">
        <div className="payment-type-form__field">
          <label className="payment-type-form__label">
            Descripción <span className="payment-type-form__required">*</span>
          </label>
          <input
            type='text'
            name="description"
            className={`payment-type-form__textarea ${errors.description ? 'payment-type-form__textarea--error' : ''}`}
            value={formData.description}
            onChange={handleChange}
            placeholder="Ej: Contado, Crédito, Tarjeta de Crédito..."
          />
          {errors.description && <span className="payment-type-form__error">{errors.description}</span>}
        </div>

        <div className="payment-type-form__field payment-type-form__field--checkbox">
          <label className="payment-type-form__checkbox-label">
            <input
              type="checkbox"
              name="has_financing"
              checked={formData.has_financing}
              onChange={handleChange}
            />
            <span>Permite financiamiento</span>
          </label>
          <p className="payment-type-form__helper">
            Marque esta opción si este tipo de pago permite financiamiento a plazos
          </p>
        </div>
      </div>

      <div className="payment-type-form__actions">
        <button
          type="button"
          className="payment-type-form__button payment-type-form__button--secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="payment-type-form__button payment-type-form__button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="payment-type-form__spinner"></span>
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