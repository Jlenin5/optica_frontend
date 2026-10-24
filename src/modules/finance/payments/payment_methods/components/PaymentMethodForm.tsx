import { useState, useEffect } from "react"
import type { CreatePaymentMethodDTO, PaymentMethod } from "../types/payment-methods.types"

interface PaymentMethodFormProps {
  onSubmit: (data: CreatePaymentMethodDTO) => void
  initialData?: PaymentMethod | null
  onCancel: () => void
  isEditing: boolean
  isSubmitting?: boolean
}

export const PaymentMethodForm = ({ 
  onSubmit, 
  initialData, 
  onCancel, 
  isEditing,
  isSubmitting 
}: PaymentMethodFormProps) => {
  const [formData, setFormData] = useState({
    description: "",
    code: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        description: initialData.description || "",
        code: initialData.code || "",
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
    
    if (formData.code && formData.code.length > 3) {
      newErrors.code = "El código no puede exceder 3 caracteres"
    } else if (formData.code && !/^[A-Z0-9]+$/.test(formData.code)) {
      newErrors.code = "Solo letras mayúsculas y números"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    const submitData = {
      description: formData.description,
      code: formData.code.toUpperCase() || null,
    }
    
    onSubmit(submitData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <form className="payment-method-form" onSubmit={handleSubmit}>
      <div className="payment-method-form__section">
        <div className="payment-method-form__field">
          <label className="payment-method-form__label">
            Descripción <span className="payment-method-form__required">*</span>
          </label>
          <input
            type="text"
            name="description"
            className={`payment-method-form__textarea ${errors.description ? 'payment-method-form__textarea--error' : ''}`}
            value={formData.description}
            onChange={handleChange}
            placeholder="Ej: Tarjeta de Crédito, Transferencia Bancaria, Efectivo..."
          />
          {errors.description && <span className="payment-method-form__error">{errors.description}</span>}
        </div>

        <div className="payment-method-form__field">
          <label className="payment-method-form__label">Código</label>
          <input
            type="text"
            name="code"
            placeholder="TC"
            maxLength={3}
            className={`payment-method-form__input ${errors.code ? 'payment-method-form__input--error' : ''}`}
            value={formData.code}
            onChange={handleChange}
          />
          {errors.code && <span className="payment-method-form__error">{errors.code}</span>}
          <p className="payment-method-form__helper">Código de 3 caracteres (opcional)</p>
        </div>
      </div>

      <div className="payment-method-form__actions">
        <button
          type="button"
          className="payment-method-form__button payment-method-form__button--secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="payment-method-form__button payment-method-form__button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="payment-method-form__spinner"></span>
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