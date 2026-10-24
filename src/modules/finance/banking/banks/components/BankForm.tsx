import { useState, useEffect } from "react"
import type { Bank } from "../types/banks.types"

interface BankFormProps {
  onSubmit: (data: any) => void
  initialData?: Bank | null
  onCancel: () => void
  isEditing: boolean
  isSubmitting?: boolean
}

export const BankForm = ({ 
  onSubmit, 
  initialData, 
  onCancel, 
  isEditing,
  isSubmitting 
}: BankFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ruc: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        ruc: initialData.ruc || "",
      })
    }
  }, [initialData])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "El nombre del banco es requerido"
    } else if (formData.name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres"
    }
    
    if (formData.ruc) {
      if (formData.ruc.length !== 11) {
        newErrors.ruc = "El RUC debe tener 11 dígitos"
      } else if (!/^\d+$/.test(formData.ruc)) {
        newErrors.ruc = "El RUC debe contener solo números"
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    const submitData = {
      name: formData.name,
      description: formData.description || null,
      ruc: formData.ruc || null,
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
    <form className="bank-form" onSubmit={handleSubmit}>
      <div className="bank-form__section">
        <div className="bank-form__field">
          <label className="bank-form__label">
            Nombre del Banco <span className="bank-form__required">*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Ej: Banco de Crédito del Perú"
            className={`bank-form__input ${errors.name ? 'bank-form__input--error' : ''}`}
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="bank-form__error">{errors.name}</span>}
        </div>

        <div className="bank-form__field">
          <label className="bank-form__label">
            RUC <span className="bank-form__required">*</span>
          </label>
          <input
            type="text"
            name="ruc"
            placeholder="12345678901"
            maxLength={11}
            className={`bank-form__input ${errors.ruc ? 'bank-form__input--error' : ''}`}
            value={formData.ruc}
            onChange={handleChange}
          />
          {errors.ruc && <span className="bank-form__error">{errors.ruc}</span>}
          <p className="bank-form__helper">Número de RUC del banco (opcional)</p>
        </div>

        <div className="bank-form__field">
          <label className="bank-form__label">Descripción</label>
          <input
            type='text'
            name="description"
            className="bank-form__textarea"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descripción del banco..."
          />
        </div>
      </div>

      <div className="bank-form__actions">
        <button
          type="button"
          className="bank-form__button bank-form__button--secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bank-form__button bank-form__button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="bank-form__spinner"></span>
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