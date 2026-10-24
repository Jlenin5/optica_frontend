import { useState, useEffect } from "react"
import { useStores } from "@/modules/organizations/stores/hooks/useStores"
import { useCompanies } from "@/modules/organizations/companies/hooks/useCompanies"
import { useAuthStore } from "@/app/store/auth.store"
import type { CashRegister } from "../types/cash-registers.types"

interface CashRegisterFormProps {
  onSubmit: (data: any) => void
  initialData?: CashRegister | null
  onCancel: () => void
  isEditing: boolean
  isSubmitting?: boolean
}

export const CashRegisterForm = ({ 
  onSubmit, 
  initialData, 
  onCancel, 
  isEditing,
  isSubmitting 
}: CashRegisterFormProps) => {
  const { user, currentCompanyId, isSuperAdmin } = useAuthStore()
  const { data: storesData, isLoading: storesLoading } = useStores()
  const { data: companiesData, isLoading: companiesLoading } = useCompanies({ status: true })
  
  const [formData, setFormData] = useState({
    name: "",
    store_id: "",
    company_id: "",
    opening_amount: "",
    notes: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const stores = storesData?.pages.flatMap(page => page.results) || []
  const companies = companiesData?.results || []

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        store_id: initialData.store_id?.toString() || "",
        company_id: initialData.company_id?.toString() || "",
        opening_amount: initialData.opening_amount?.toString() || "",
        notes: initialData.notes || "",
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
    
    if (!formData.company_id) {
      newErrors.company_id = "Debe seleccionar una empresa"
    }
    
    if (!formData.opening_amount) {
      newErrors.opening_amount = "El monto de apertura es requerido"
    } else {
      const amount = parseFloat(formData.opening_amount)
      if (isNaN(amount)) {
        newErrors.opening_amount = "Ingrese un valor numérico válido"
      } else if (amount < 0) {
        newErrors.opening_amount = "El monto no puede ser negativo"
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    const submitData = {
      name: formData.name || null,
      store_id: formData.store_id ? parseInt(formData.store_id) : null,
      company_id: parseInt(formData.company_id),
      opening_amount: parseFloat(formData.opening_amount),
      notes: formData.notes || null,
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

  if (storesLoading || companiesLoading) {
    return (
      <div className="cash-register-form__loading">
        <div className="cash-register-form__spinner"></div>
        <p>Cargando datos...</p>
      </div>
    )
  }

  return (
    <form className="cash-register-form" onSubmit={handleSubmit}>
      <div className="cash-register-form__section">
        <div className="cash-register-form__row">
          <div className="cash-register-form__field">
            <label className="cash-register-form__label">
              Empresa <span className="cash-register-form__required">*</span>
            </label>
            {isSuperAdmin ? (
              <select
                name="company_id"
                className={`cash-register-form__select ${errors.company_id ? 'cash-register-form__select--error' : ''}`}
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
            ) : (
              <div className="cash-register-form__static">
                {user?.company?.name || 'Mi Empresa'}
              </div>
            )}
            {errors.company_id && <span className="cash-register-form__error">{errors.company_id}</span>}
          </div>

          <div className="cash-register-form__field">
            <label className="cash-register-form__label">Tienda</label>
            <select
              name="store_id"
              className="cash-register-form__select"
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
        </div>

        <div className="cash-register-form__row">
          <div className="cash-register-form__field">
            <label className="cash-register-form__label">Nombre de la Caja</label>
            <input
              type="text"
              name="name"
              placeholder="Ej: Caja Principal"
              className="cash-register-form__input"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="cash-register-form__field">
            <label className="cash-register-form__label">
              Monto de Apertura <span className="cash-register-form__required">*</span>
            </label>
            <div className="cash-register-form__amount-input">
              <span className="cash-register-form__currency">S/</span>
              <input
                type="number"
                name="opening_amount"
                step="0.01"
                min="0"
                placeholder="0.00"
                className={`cash-register-form__input ${errors.opening_amount ? 'cash-register-form__input--error' : ''}`}
                value={formData.opening_amount}
                onChange={handleChange}
              />
            </div>
            {errors.opening_amount && <span className="cash-register-form__error">{errors.opening_amount}</span>}
          </div>
        </div>

        <div className="cash-register-form__field">
          <label className="cash-register-form__label">Notas</label>
          <textarea
            name="notes"
            className="cash-register-form__textarea"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Notas adicionales..."
          />
        </div>
      </div>

      <div className="cash-register-form__actions">
        <button
          type="button"
          className="cash-register-form__button cash-register-form__button--secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="cash-register-form__button cash-register-form__button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="cash-register-form__spinner"></span>
              Abriendo caja...
            </>
          ) : (
            'Abrir Caja'
          )}
        </button>
      </div>
    </form>
  )
}