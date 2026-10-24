import { useState, useEffect } from "react"
import type { Currency } from "../types/currencies.types"

interface CurrencyFormProps {
  onSubmit: (data: any) => void
  initialData?: Currency | null
  onCancel: () => void
  isEditing: boolean
  isSubmitting?: boolean
}

export const CurrencyForm = ({ 
  onSubmit, 
  initialData, 
  onCancel, 
  isEditing,
  isSubmitting 
}: CurrencyFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    symbol: "",
    description: "",
    is_local: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        code: initialData.code || "",
        symbol: initialData.symbol || "",
        description: initialData.description || "",
        is_local: initialData.is_local || false 
      })
    }
  }, [initialData])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "El nombre de la moneda es requerido"
    } else if (formData.name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres"
    }
    
    if (!formData.code.trim()) {
      newErrors.code = "El código es requerido"
    } else if (!/^[A-Z]{3}$/.test(formData.code)) {
      newErrors.code = "El código debe tener 3 letras mayúsculas (ej: PEN, USD)"
    }
    
    if (!formData.symbol.trim()) {
      newErrors.symbol = "El símbolo es requerido"
    } else if (formData.symbol.length > 5) {
      newErrors.symbol = "El símbolo no puede tener más de 5 caracteres"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    const submitData = {
      name: formData.name,
      code: formData.code.toUpperCase(),
      symbol: formData.symbol,
      description: formData.description || null,
      is_local: formData.is_local
    }
    
    onSubmit(submitData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    <form className="currency-form" onSubmit={handleSubmit}>
      <div className="currency-form__section">
        <div className="currency-form__row">
          <div className="currency-form__field">
            <label className="currency-form__label">
              Nombre <span className="currency-form__required">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Ej: Sol Peruano"
              className={`currency-form__input ${errors.name ? 'currency-form__input--error' : ''}`}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="currency-form__error">{errors.name}</span>}
          </div>

          <div className="currency-form__field">
            <label className="currency-form__label">
              Código <span className="currency-form__required">*</span>
            </label>
            <input
              type="text"
              name="code"
              placeholder="PEN"
              maxLength={3}
              className={`currency-form__input ${errors.code ? 'currency-form__input--error' : ''}`}
              value={formData.code}
              onChange={handleChange}
            />
            {errors.code && <span className="currency-form__error">{errors.code}</span>}
            <p className="currency-form__helper">Código ISO de 3 letras (PEN, USD, EUR)</p>
          </div>
        </div>

        <div className="currency-form__row">
          <div className="currency-form__field">
            <label className="currency-form__label">
              Símbolo <span className="currency-form__required">*</span>
            </label>
            <input
              type="text"
              name="symbol"
              placeholder="S/"
              maxLength={5}
              className={`currency-form__input ${errors.symbol ? 'currency-form__input--error' : ''}`}
              value={formData.symbol}
              onChange={handleChange}
            />
            {errors.symbol && <span className="currency-form__error">{errors.symbol}</span>}
          </div>

          <div className="currency-form__field">
            <label className="currency-form__label">Descripción</label>
            <input
              name="description"
              className="currency-form__textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción opcional..."
            />
          </div>

          <div className="payment-type-form__field payment-type-form__field--checkbox">
            <label className="payment-type-form__checkbox-label">
              <input
                type="checkbox"
                name="is_local"
                checked={formData.is_local}
                onChange={handleChange}
              />
              <span>Es moneda local</span>
            </label>
            <p className="payment-type-form__helper">
              Marque esta opción si esta moneda local
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}