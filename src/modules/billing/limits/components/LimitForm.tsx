import { useState } from "react"
import type { Limit } from "../types/limits.types"

interface LimitFormProps {
  onSubmit: (data: any) => void
  initialData?: Limit | null
  onCancel: () => void
  isEditing: boolean
  isSubmitting?: boolean
}

export const LimitForm = ({ 
  onSubmit, 
  initialData, 
  onCancel, 
  isEditing,
  isSubmitting 
}: LimitFormProps) => {
  const [formData, setFormData] = useState({
    code: initialData?.code || '',
    name: initialData?.name || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.code.trim()) {
      newErrors.code = 'El código es requerido'
    } else if (!/^[a-z0-9_]+$/.test(formData.code)) {
      newErrors.code = 'Solo letras minúsculas, números y guiones bajos'
    }

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="limit-form">
      <div className="limit-form__field">
        <label htmlFor="code">Código *</label>
        <input
          type="text"
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="max_usuarios"
          className={errors.code ? 'error' : ''}
        />
        {errors.code && <span className="limit-form__error">{errors.code}</span>}
        <p className="limit-form__helper">
          Identificador único del límite (ej: max_users, max_products)
        </p>
      </div>

      <div className="limit-form__field">
        <label htmlFor="name">Nombre *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Máximo de usuarios"
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="limit-form__error">{errors.name}</span>}
        <p className="limit-form__helper">
          Nombre descriptivo del límite que verán los usuarios
        </p>
      </div>

      <div className="limit-form__actions">
        <button 
          type="button" 
          className="limit-form__cancel" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className="limit-form__submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="limit-form__spinner"></span>
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