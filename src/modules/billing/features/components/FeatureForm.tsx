import { useState } from "react"
import type { Feature } from "../types/features.types"

interface FeatureFormProps {
  onSubmit: (data: any) => void
  initialData?: Feature | null
  onCancel: () => void
  isEditing: boolean
  isSubmitting?: boolean
}

export const FeatureForm = ({ 
  onSubmit, 
  initialData, 
  onCancel, 
  isEditing,
  isSubmitting 
}: FeatureFormProps) => {
  const [formData, setFormData] = useState({
    code: initialData?.code || '',
    name: initialData?.name || '',
    description: initialData?.description || '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="feature-form">
      <div className="feature-form__field">
        <label htmlFor="code">Código *</label>
        <input
          type="text"
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="sales_module"
          className={errors.code ? 'error' : ''}
        />
        {errors.code && <span className="feature-form__error">{errors.code}</span>}
        <p className="feature-form__helper">
          Identificador único de la característica (ej: sales_module, inventory_module)
        </p>
      </div>

      <div className="feature-form__field">
        <label htmlFor="name">Nombre *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Módulo de Ventas"
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="feature-form__error">{errors.name}</span>}
      </div>

      <div className="feature-form__field">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Describe la funcionalidad de esta característica..."
        />
        <p className="feature-form__helper">
          Descripción detallada de lo que incluye esta característica
        </p>
      </div>
    </form>
  )
}