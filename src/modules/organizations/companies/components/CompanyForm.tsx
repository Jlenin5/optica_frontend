import { useState } from "react"
import type { Company } from "../types/companies.types"

interface CompanyFormProps {
  onSubmit: (data: any) => void
  initialData?: Company | null
  onCancel: () => void
  isEditing: boolean
  isSubmitting?: boolean
}

export const CompanyForm = ({ 
  onSubmit, 
  initialData, 
  onCancel, 
  isEditing,
  isSubmitting 
}: CompanyFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    ruc: initialData?.ruc || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    web_site: initialData?.web_site || '',
    address: initialData?.address || '',
    einvoice_username: initialData?.einvoice_username || '',
    einvoice_token: initialData?.einvoice_token || '',
    status: initialData?.status ?? true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la empresa es requerido'
    }

    if (!formData.ruc.trim()) {
      newErrors.ruc = 'El RUC es requerido'
    } else if (!/^\d{11}$/.test(formData.ruc)) {
      newErrors.ruc = 'El RUC debe tener 11 dígitos'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    const submitData = {
      ...formData,
      status: formData.status
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
    <form onSubmit={handleSubmit} className="company-form">
      <div className="company-form__section">
        <h4 className="company-form__section-title">Información Básica</h4>
        
        <div className="company-form__row">
          <div className="company-form__field">
            <label htmlFor="name">Nombre de la Empresa *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Óptica Visión S.A.C."
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="company-form__error">{errors.name}</span>}
          </div>

          <div className="company-form__field">
            <label htmlFor="ruc">RUC *</label>
            <input
              type="text"
              id="ruc"
              name="ruc"
              value={formData.ruc}
              onChange={handleChange}
              placeholder="12345678901"
              maxLength={11}
              className={errors.ruc ? 'error' : ''}
            />
            {errors.ruc && <span className="company-form__error">{errors.ruc}</span>}
          </div>
        </div>

        <div className="company-form__row">
          <div className="company-form__field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contacto@empresa.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="company-form__error">{errors.email}</span>}
          </div>

          <div className="company-form__field">
            <label htmlFor="phone">Teléfono *</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="987654321"
              maxLength={9}
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="company-form__error">{errors.phone}</span>}
          </div>
        </div>

        <div className="company-form__row">
          <div className="company-form__field">
            <label htmlFor="web_site">Sitio Web</label>
            <input
              type="text"
              id="web_site"
              name="web_site"
              value={formData.web_site}
              onChange={handleChange}
              placeholder="https://www.empresa.com"
            />
          </div>

          <div className="company-form__field">
            <label htmlFor="address">Dirección</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Av. Principal 123, Lima"
            />
          </div>
        </div>
      </div>

      <div className="company-form__section">
        <h4 className="company-form__section-title">Configuración Facturación Electrónica</h4>
        
        <div className="company-form__row">
          <div className="company-form__field">
            <label htmlFor="einvoice_username">Usuario SUNAT</label>
            <input
              type="text"
              id="einvoice_username"
              name="einvoice_username"
              value={formData.einvoice_username}
              onChange={handleChange}
              placeholder="Usuario para facturación electrónica"
            />
          </div>

          <div className="company-form__field">
            <label htmlFor="einvoice_token">Token SUNAT</label>
            <input
              type="password"
              id="einvoice_token"
              name="einvoice_token"
              value={formData.einvoice_token}
              onChange={handleChange}
              placeholder="Token de autenticación"
            />
          </div>
        </div>
      </div>

      <div className="company-form__section">
        <div className="company-form__field company-form__field--checkbox">
          <label className="company-form__checkbox">
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
            />
            <span>Empresa Activa</span>
          </label>
          <p className="company-form__helper">
            Las empresas inactivas no aparecerán en las opciones de selección
          </p>
        </div>
      </div>

      <div className="company-form__actions">
        <button 
          type="button" 
          className="company-form__cancel" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className="company-form__submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="company-form__spinner"></span>
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