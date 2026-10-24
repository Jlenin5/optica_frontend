import { useState, useEffect } from "react"
import { useCompanies } from "@/modules/organizations/companies/hooks/useCompanies"
import { useBranchOffices } from "@/modules/organizations/branch-offices/hooks/useBranchOffices"
import { useAuthStore } from "@/app/store/auth.store"
import type { Warehouse } from "../types/warehouses.types"

interface WarehouseFormProps {
  onSubmit: (data: any) => void
  initialData?: Warehouse | null
  onCancel: () => void
  isEditing: boolean
  isSubmitting?: boolean
}

export const WarehouseForm = ({ 
  onSubmit, 
  initialData, 
  onCancel, 
  isEditing,
  isSubmitting 
}: WarehouseFormProps) => {
  const { user, currentCompanyId, isSuperAdmin } = useAuthStore()
  const { data: companiesData, isLoading: companiesLoading } = useCompanies({ status: true })
  const { data: branchOfficesData, isLoading: branchOfficesLoading } = useBranchOffices({ 
    company_id: currentCompanyId || undefined,
    status: true 
  })
  
  const [formData, setFormData] = useState({
    name: "",
    company_or_branch_office: true as boolean,
    company_id: null as number | null,
    branch_office_id: null as number | null,
    phone: "",
    address: "",
    status: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const companies = companiesData?.results || []
  const branchOffices = branchOfficesData?.pages.flatMap(page => page.results) || []

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        company_or_branch_office: initialData.company_or_branch_office,
        company_id: initialData.company_id || null,
        branch_office_id: initialData.branch_office_id || null,
        phone: initialData.phone || "",
        address: initialData.address || "",
        status: initialData.status !== undefined ? initialData.status : true
      })
    } else {
      setFormData({
        name: "",
        company_or_branch_office: true,
        company_id: isSuperAdmin ? null : currentCompanyId,
        branch_office_id: null,
        phone: "",
        address: "",
        status: true
      })
    }
  }, [initialData, isSuperAdmin, currentCompanyId])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "El nombre del almacén es requerido"
    } else if (formData.name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres"
    }
    
    if (formData.company_or_branch_office) {
      if (!formData.company_id) {
        newErrors.company_id = "Debe seleccionar una empresa"
      }
    } else {
      if (!formData.branch_office_id) {
        newErrors.branch_office_id = "Debe seleccionar una sucursal"
      }
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
      company_or_branch_office: formData.company_or_branch_office,
      company_id: formData.company_or_branch_office ? (formData.company_id || currentCompanyId) : null,
      branch_office_id: !formData.company_or_branch_office ? formData.branch_office_id : null,
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
    
    if (name === 'company_or_branch_office') {
      setFormData(prev => ({
        ...prev,
        company_id: null,
        branch_office_id: null
      }))
    }
  }

  if (companiesLoading || branchOfficesLoading) {
    return (
      <div className="warehouse-form__loading">
        <div className="warehouse-form__spinner"></div>
        <p>Cargando datos...</p>
      </div>
    )
  }

  const currentCompanyName = user?.company?.name || 'Mi Empresa'

  return (
    <form className="warehouse-form" onSubmit={handleSubmit}>
      <div className="warehouse-form__section">
        <div className="warehouse-form__row">
          <div className="warehouse-form__field">
            <label className="warehouse-form__label">
              Nombre del Almacén <span className="warehouse-form__required">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Almacén Central"
              className={`warehouse-form__input ${errors.name ? 'warehouse-form__input--error' : ''}`}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="warehouse-form__error">{errors.name}</span>}
          </div>

          <div className="warehouse-form__field">
            <label className="warehouse-form__label">Teléfono</label>
            <input
              type="tel"
              name="phone"
              placeholder="987654321"
              maxLength={9}
              className={`warehouse-form__input ${errors.phone ? 'warehouse-form__input--error' : ''}`}
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="warehouse-form__error">{errors.phone}</span>}
          </div>
        </div>

        <div className="warehouse-form__field">
          <label className="warehouse-form__label">Dirección</label>
          <input
            name="address"
            placeholder="Av. Principal 123, Lima"
            className="warehouse-form__textarea"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="warehouse-form__field warehouse-form__field--radio">
          <label className="warehouse-form__label">Tipo de Almacén</label>
          <div className="warehouse-form__radio-group">
            <label className="warehouse-form__radio-label">
              <input
                type="radio"
                name="company_or_branch_office"
                value="true"
                checked={formData.company_or_branch_office === true}
                onChange={() => setFormData(prev => ({ ...prev, company_or_branch_office: true, company_id: null, branch_office_id: null }))}
              />
              <span>Almacén de Empresa</span>
            </label>
            <label className="warehouse-form__radio-label">
              <input
                type="radio"
                name="company_or_branch_office"
                value="false"
                checked={formData.company_or_branch_office === false}
                onChange={() => setFormData(prev => ({ ...prev, company_or_branch_office: false, company_id: null, branch_office_id: null }))}
              />
              <span>Almacén de Sucursal</span>
            </label>
          </div>
        </div>

        {formData.company_or_branch_office ? (
          <div className="warehouse-form__field">
            <label className="warehouse-form__label">
              Empresa <span className="warehouse-form__required">*</span>
            </label>
            {isSuperAdmin ? (
              <select
                name="company_id"
                className={`warehouse-form__select ${errors.company_id ? 'warehouse-form__select--error' : ''}`}
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
            ) : (
              <div className="warehouse-form__static">
                {currentCompanyName}
              </div>
            )}
            {errors.company_id && <span className="warehouse-form__error">{errors.company_id}</span>}
          </div>
        ) : (
          <div className="warehouse-form__field">
            <label className="warehouse-form__label">
              Sucursal <span className="warehouse-form__required">*</span>
            </label>
            <select
              name="branch_office_id"
              className={`warehouse-form__select ${errors.branch_office_id ? 'warehouse-form__select--error' : ''}`}
              value={formData.branch_office_id || ''}
              onChange={handleChange}
            >
              <option value="">Seleccionar sucursal</option>
              {branchOffices.map(office => (
                <option key={office.id} value={office.id}>
                  {office.name}
                </option>
              ))}
            </select>
            {errors.branch_office_id && <span className="warehouse-form__error">{errors.branch_office_id}</span>}
          </div>
        )}

        <div className="warehouse-form__field warehouse-form__field--checkbox">
          <label className="warehouse-form__checkbox-label">
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
            />
            <span>Almacén activo</span>
          </label>
        </div>
      </div>

      <div className="warehouse-form__actions">
        <button
          type="button"
          className="warehouse-form__button warehouse-form__button--secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="warehouse-form__button warehouse-form__button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="warehouse-form__spinner"></span>
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