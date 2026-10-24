import { useState } from "react"
import type { CreateReceiptDTO, Receipt } from "../types/receipts.types"

interface ReceiptFormProps {
  onSubmit: (data: CreateReceiptDTO) => void
  initialData?: Receipt | null
  onCancel: () => void
  isEditing: boolean
  isSubmitting?: boolean
}

export const ReceiptForm = ({ 
  onSubmit, 
  initialData, 
  onCancel, 
  isEditing,
  isSubmitting 
}: ReceiptFormProps) => {
  const [formData, setFormData] = useState({
    code: initialData?.code || '',
    description: initialData?.description || '',
    requires_sunat: initialData?.requires_sunat ?? false,
    status: initialData?.status ?? true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.code || !formData.code.trim()) {
      newErrors.code = 'El código es requerido'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
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
    <form onSubmit={handleSubmit} className="receipt-form">
      <div className="receipt-form__field">
        <label htmlFor="code">
          Código
        </label>
        <input
          id="code"
          name="code"
          type="text"
          value={formData.code}
          onChange={handleChange}
          placeholder="Ej: 01"
          className={errors.code ? 'error' : ''}
        />
        {errors.code && <span className="receipt-form__error">{errors.code}</span>}
        <p className="receipt-form__helper">
          Ingresa el código del recibo
        </p>
      </div>
      
      <div className="receipt-form__field">
        <label htmlFor="description">
          Descripción *
        </label>
        <input
          id="description"
          name="description"
          type="text"
          value={formData.description}
          onChange={handleChange}
          placeholder="Ingrese la descripción del recibo..."
          className={errors.description ? 'error' : ''}
        />
        {errors.description && <span className="receipt-form__error">{errors.description}</span>}
        <p className="receipt-form__helper">
          Describe el motivo o concepto del recibo
        </p>
      </div>

      <div className="receipt-form__field receipt-form__field--checkbox">
        <label className="receipt-form__checkbox">
          <span>Requerido por SUNAT</span>
          <input
            type="checkbox"
            name="requires_sunat"
            checked={formData.requires_sunat}
            onChange={handleChange}
          />
        </label>
        <p className="receipt-form__helper">
          El compobante es requerido por SUNAT para efectos tributarios
        </p>
      </div>

      {isEditing && (
        <div className="receipt-form__field receipt-form__field--checkbox">
          <label className="receipt-form__checkbox">
            <span>Recibo Activo</span>
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
            />
          </label>
          <p className="receipt-form__helper">
            Los recibos inactivos no aparecerán en las búsquedas principales
          </p>
        </div>
      )}

      <div className="receipt-form__actions">
        <button 
          type="button" 
          className="receipt-form__cancel" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className="receipt-form__submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="receipt-form__spinner"></span>
              {isEditing ? 'Actualizando...' : 'Creando...'}
            </>
          ) : (
            isEditing ? 'Actualizar Recibo' : 'Crear Recibo'
          )}
        </button>
      </div>
    </form>
  )
}