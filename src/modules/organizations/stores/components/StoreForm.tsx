import { useState, useEffect } from "react"
import { useBranchOffices } from "@/modules/organizations/branch-offices/hooks/useBranchOffices"
import { useAuthStore } from "@/app/store/auth.store"
import type { Store } from "../types/stores.types"

interface StoreFormProps {
  onSubmit: (data: Partial<Store>) => void
  initialData?: Store | null
  onCancel: () => void
  isEditing: boolean
  isSubmitting?: boolean
}

export const StoreForm = ({ 
  onSubmit,
  initialData,
  onCancel,
  isEditing,
  isSubmitting
}: StoreFormProps) => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  const { data: branchOfficesData, isLoading: branchOfficesLoading } = useBranchOffices({
    status: true 
  })
  
  const [formData, setFormData] = useState({
    name: "",
    company_id: currentCompanyId,
    branch_office_id: null as number | null,
    phone: "",
    address: "",
    status: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const branchOffices = branchOfficesData?.pages.flatMap(page => page.results) || []

  // Filtrar sucursales por empresa si no es super_admin
  const filteredBranchOffices = isSuperAdmin 
    ? branchOffices 
    : branchOffices.filter(bo => bo.company_id === currentCompanyId)

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        company_id: currentCompanyId,
        branch_office_id: initialData.branch_office_id || null,
        phone: initialData.phone || "",
        address: initialData.address || "",
        status: initialData.status !== undefined ? initialData.status : true
      })
    } else {
      setFormData({
        name: "",
        company_id: currentCompanyId,
        branch_office_id: null,
        phone: "",
        address: "",
        status: true
      })
    }
  }, [initialData, currentCompanyId])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "El nombre de la tienda es requerido"
    } else if (formData.name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres"
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
      name: formData.name,
      company_id: currentCompanyId,
      branch_office_id: formData.branch_office_id || null,
      address: formData.address || null,
      phone: formData.phone || null,
      status: formData.status
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

  if (branchOfficesLoading) {
    return (
      <div className="store-form__loading">
        <div className="store-form__spinner"></div>
        <p>Cargando datos...</p>
      </div>
    )
  }

  return (
    <form className="store-form" onSubmit={handleSubmit}>
      <div className="store-form__section">
        <div className="store-form__row">
          <div className="store-form__field">
            <label className="store-form__label">
              Nombre de la Tienda <span className="store-form__required">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Tienda Principal"
              className={`store-form__input ${errors.name ? 'store-form__input--error' : ''}`}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="store-form__error">{errors.name}</span>}
          </div>

          <div className="store-form__field">
            <label className="store-form__label">Teléfono</label>
            <input
              type="tel"
              name="phone"
              placeholder="987654321"
              maxLength={9}
              className={`store-form__input ${errors.phone ? 'store-form__input--error' : ''}`}
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="store-form__error">{errors.phone}</span>}
          </div>
        </div>

        <div className="store-form__field">
          <label className="store-form__label">
            Sucursal
          </label>
          <select
            name="branch_office_id"
            className={`store-form__select`}
            value={formData.branch_office_id || ''}
            onChange={handleChange}
          >
            <option value="">Seleccionar sucursal</option>
            {filteredBranchOffices.map(office => (
              <option key={office.id} value={office.id}>
                {office.name} {isSuperAdmin && office.company?.name ? `(${office.company.name})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="store-form__field">
          <label className="store-form__label">Dirección</label>
          <textarea
            name="address"
            placeholder="Av. Principal 123, Lima"
            className="store-form__textarea"
            value={formData.address}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="store-form__field store-form__field--checkbox">
          <label className="store-form__checkbox-label">
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
            />
            <span>Tienda activa</span>
          </label>
        </div>
      </div>

      <div className="store-form__actions">
        <button
          type="button"
          className="store-form__button store-form__button--secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="store-form__button store-form__button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="store-form__spinner"></span>
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