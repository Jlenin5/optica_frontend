import { useState, useEffect } from "react"
import { useCompanies } from "@/modules/organizations/companies/hooks/useCompanies"
import { useAuthStore } from "@/app/store/auth.store"
import type { BranchOffice } from "../types/branch-offices.types"

interface BranchOfficeFormProps {
  onSubmit: (data: any) => void
  initialData?: BranchOffice | null
  onCancel: () => void
  isEditing: boolean
  isSubmitting?: boolean
}

export const BranchOfficeForm = ({ 
  onSubmit, 
  initialData, 
  onCancel, 
  isEditing,
  isSubmitting 
}: BranchOfficeFormProps) => {
  const { user, currentCompanyId, isSuperAdmin } = useAuthStore()
  const { data: companiesData, isLoading: companiesLoading } = useCompanies({ status: true })
  
  const [formData, setFormData] = useState({
    name: "",
    company_id: null as number | null,
    phone: "",
    address: "",
    status: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const companies = companiesData?.results || []

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        company_id: initialData.company_id || null,
        phone: initialData.phone || "",
        address: initialData.address || "",
        status: initialData.status !== undefined ? initialData.status : true
      })
    } else {
      setFormData({
        name: "",
        company_id: isSuperAdmin ? null : currentCompanyId,
        phone: "",
        address: "",
        status: true
      })
    }
  }, [initialData, isSuperAdmin, currentCompanyId])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "El nombre de la sucursal es requerido"
    } else if (formData.name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres"
    }
    
    if (!isSuperAdmin && !formData.company_id) {
      newErrors.company_id = "La empresa es requerida"
    }
    
    if (formData.phone && !/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = "El teléfono contiene caracteres no válidos"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    const submitData = {
      ...formData,
      company_id: formData.company_id || currentCompanyId,
      address: formData.address || null,
      phone: formData.phone || null
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

  if (companiesLoading) {
    return (
      <div className="branch-office-form__loading">
        <div className="branch-office-form__spinner"></div>
        <p>Cargando datos...</p>
      </div>
    )
  }

  const currentCompanyName = user?.company?.name || 'Mi Empresa'

  return (
    <form className="branch-office-form" onSubmit={handleSubmit}>
      <div className="branch-office-form__section">
        <div className="branch-office-form__row">
          <div className="branch-office-form__field">
            <label className="branch-office-form__label">
              Nombre de la Sucursal <span className="branch-office-form__required">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Sucursal Centro"
              className={`branch-office-form__input ${errors.name ? 'branch-office-form__input--error' : ''}`}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="branch-office-form__error">{errors.name}</span>}
          </div>

          {isSuperAdmin ? (
            <div className="branch-office-form__field">
              <label className="branch-office-form__label">
                Empresa <span className="branch-office-form__required">*</span>
              </label>
              <select
                name="company_id"
                className={`branch-office-form__select ${errors.company_id ? 'branch-office-form__select--error' : ''}`}
                value={formData.company_id || ''}
                onChange={handleChange}
              >
                <option value="">Seleccionar empresa</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              {errors.company_id && <span className="branch-office-form__error">{errors.company_id}</span>}
            </div>
          ) : (
            currentCompanyId && (
              <div className="branch-office-form__field">
                <label className="branch-office-form__label">Empresa</label>
                <div className="branch-office-form__static">
                  {currentCompanyName}
                </div>
                <input type="hidden" name="company_id" value={currentCompanyId} />
              </div>
            )
          )}
        </div>

        <div className="branch-office-form__row">
          <div className="branch-office-form__field">
            <label className="branch-office-form__label">Teléfono</label>
            <input
              type="tel"
              name="phone"
              placeholder="987654321"
              maxLength={9}
              className={`branch-office-form__input ${errors.phone ? 'branch-office-form__input--error' : ''}`}
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="branch-office-form__error">{errors.phone}</span>}
            <p className="branch-office-form__helper">
              Número de contacto de la sucursal (opcional)
            </p>
          </div>

          <div className="branch-office-form__field">
            <label className="branch-office-form__label">Dirección</label>
            <input
              type="text"
              name="address"
              placeholder="Av. Principal 123, Lima"
              className="branch-office-form__input"
              value={formData.address}
              onChange={handleChange}
            />
            <p className="branch-office-form__helper">
              Dirección física de la sucursal (opcional)
            </p>
          </div>
        </div>

        <div className="branch-office-form__field branch-office-form__field--checkbox">
          <label className="branch-office-form__checkbox-label">
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
            />
            <span>Sucursal activa</span>
          </label>
        </div>
      </div>

      <div className="branch-office-form__actions">
        <button
          type="button"
          className="branch-office-form__button branch-office-form__button--secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="branch-office-form__button branch-office-form__button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="branch-office-form__spinner"></span>
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