import { useState, useEffect } from "react"
import { useStores } from "@/modules/organizations/stores/hooks/useStores"
import { useCompanies } from "@/modules/organizations/companies/hooks/useCompanies"
import { useAuthStore } from "@/app/store/auth.store"
import { useCreateCashRegister } from "../hooks/useCreateCashRegister"
import { useUpdateCashRegister } from "../hooks/useUpdateCashRegister"
import type { CashRegister } from "../types/cash-registers.types"
import { AppModal } from "@/components/ui/modal"

interface CashRegisterFormModalProps {
  initialData?: CashRegister | null
  onSubmit: () => void
  onCancel: () => void
}

export const CashRegisterFormModal = ({ initialData, onSubmit, onCancel }: CashRegisterFormModalProps) => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  const { data: storesData, isLoading: storesLoading } = useStores()
  const { data: companiesData, isLoading: companiesLoading } = useCompanies({ status: true })
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    company_id: "",
    store_id: "",
    status: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const { mutate: createRegister, isPending: isCreating } = useCreateCashRegister()
  const { mutate: updateRegister, isPending: isUpdating } = useUpdateCashRegister()

  const stores = storesData?.pages.flatMap(page => page.results) || []
  const companies = companiesData?.results || []
  const isEditing = !!initialData

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        store_id: initialData.store_id?.toString() || "",
        company_id: initialData.company_id?.toString() || "",
        status: initialData.status !== undefined ? initialData.status : true
      })
    } else {
      setFormData(prev => ({
        ...prev,
        company_id: isSuperAdmin ? "" : currentCompanyId?.toString() || ""
      }))
    }
  }, [initialData, isSuperAdmin, currentCompanyId])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "El nombre de la caja es requerido"
    } else if (formData.name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres"
    }
    
    if (!formData.company_id && isSuperAdmin) {
      newErrors.company_id = "Debe seleccionar una empresa"
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
      store_id: formData.store_id ? parseInt(formData.store_id) : null,
      company_id: isSuperAdmin ? parseInt(formData.company_id) : currentCompanyId,
      status: formData.status
    }
    
    if (isEditing && initialData) {
      updateRegister(
        { id: initialData.id, data: submitData },
        {
          onSuccess: () => {
            onSubmit()
          }
        }
      )
    } else {
      createRegister(submitData, {
        onSuccess: () => {
          onSubmit()
        }
      })
    }
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

  if (storesLoading || companiesLoading) {
    return (
      <AppModal title={isEditing ? 'Editar Caja' : 'Nueva Caja'} onClose={onCancel} size="sm">
        <div className="ui-loading"><span className="ui-spinner" /><span>Cargando datos...</span></div>
      </AppModal>
    )
  }

  const isSubmitting = isCreating || isUpdating

  return (
    <AppModal title={isEditing ? 'Editar Caja' : 'Nueva Caja'} onClose={onCancel}>
        <form className="cash-register-form-modal__form" onSubmit={handleSubmit}>
          <div className="cash-register-form-modal__field">
            <label className="cash-register-form-modal__label">
              Nombre <span className="cash-register-form-modal__required">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Ej: Caja Principal"
              className={`cash-register-form-modal__input ${errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="cash-register-form-modal__error">{errors.name}</span>}
          </div>

          <div className="cash-register-form-modal__field">
            <label className="cash-register-form-modal__label">Descripción</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Descripción de la caja..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="cash-register-form-modal__row">
            <div className="cash-register-form-modal__field">
              <label className="cash-register-form-modal__label">Tienda</label>
              <select
                name="store_id"
                value={formData.store_id}
                onChange={handleChange}
              >
                <option value="">Seleccionar tienda</option>
                {stores.map(store => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>

            {isSuperAdmin && (
              <div className="cash-register-form-modal__field">
                <label className="cash-register-form-modal__label">
                  Empresa <span className="cash-register-form-modal__required">*</span>
                </label>
                <select
                  name="company_id"
                  className={errors.company_id ? 'error' : ''}
                  value={formData.company_id}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar empresa</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
                {errors.company_id && <span className="cash-register-form-modal__error">{errors.company_id}</span>}
              </div>
            )}
          </div>

          <div className="cash-register-form-modal__field cash-register-form-modal__field--checkbox">
            <label className="cash-register-form-modal__checkbox">
              <input
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
              />
              <span>Caja activa</span>
            </label>
          </div>

          <div className="cash-register-form-modal__actions">
            <button
              type="button"
              className="cash-register-form-modal__btn cash-register-form-modal__btn--secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="cash-register-form-modal__btn cash-register-form-modal__btn--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="cash-register-form-modal__spinner"></span>
                  {isEditing ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                isEditing ? 'Actualizar Caja' : 'Crear Caja'
              )}
            </button>
          </div>
        </form>
    </AppModal>
  )
}