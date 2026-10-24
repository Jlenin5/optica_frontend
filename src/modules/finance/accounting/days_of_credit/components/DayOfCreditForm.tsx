import { useState, useEffect } from "react"
import type { DayOfCredit } from "../types/days-of-credit.types"
import { useAuthStore } from "@/app/store/auth.store"
import { useCompanies } from "@/modules/organizations/companies/hooks/useCompanies"

interface DayOfCreditFormProps {
  onSubmit: (data: any) => void
  initialData?: DayOfCredit | null
  onCancel: () => void
  isEditing: boolean
  isSubmitting?: boolean
}

export const DayOfCreditForm = ({ 
  onSubmit, 
  initialData, 
  onCancel, 
  isEditing,
  isSubmitting 
}: DayOfCreditFormProps) => {
  const { user, currentCompanyId, isSuperAdmin } = useAuthStore()
   const { data: companiesData, isLoading: companiesLoading } = useCompanies({ status: true })

  const [formData, setFormData] = useState({
    company_id: "",
    amount_in_days: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const companies = companiesData?.results || []

  useEffect(() => {
    if (initialData) {
      setFormData({
        company_id: initialData.company_id?.toString() || "",
        amount_in_days: initialData.amount_in_days || "",
      })
    } else {
      setFormData(prev => ({
        ...prev,
        company_id: isSuperAdmin ? "" : currentCompanyId?.toString() || ""
      }))
    }
  }, [initialData])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (formData.amount_in_days) {
      const days = parseInt(formData.amount_in_days)
      if (isNaN(days)) {
        newErrors.amount_in_days = "Ingrese un número válido"
      } else if (days < 0) {
        newErrors.amount_in_days = "Los días deben ser un número positivo"
      } else if (days > 365) {
        newErrors.amount_in_days = "Los días no pueden exceder 365"
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    const submitData = {
      company_id: parseInt(formData.company_id),
      amount_in_days: formData.amount_in_days || null,
    }
    
    onSubmit(submitData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (companiesLoading) {
    return (
      <div className="bank-account-form__loading">
        <div className="bank-account-form__spinner"></div>
        <p>Cargando datos...</p>
      </div>
    )
  }

  return (
    <form className="day-of-credit-form" onSubmit={handleSubmit}>
      <div className="day-of-credit-form__section">
        <div className="day-of-credit-form__field">
          <label className="day-of-credit-form__label">
            Días de Crédito <span className="bank-account-form__required">*</span>
          </label>
          <input
            type="number"
            name="amount_in_days"
            placeholder="Ej: 30"
            required
            min="0"
            max="365"
            className={`day-of-credit-form__input ${errors.amount_in_days ? 'day-of-credit-form__input--error' : ''}`}
            value={formData.amount_in_days}
            onChange={handleChange}
          />
          {errors.amount_in_days && <span className="day-of-credit-form__error">{errors.amount_in_days}</span>}
          <p className="day-of-credit-form__helper">
            Número de días de crédito (opcional). Dejar vacío si no aplica.
          </p>
        </div>
      </div>

      <div className="bank-account-form__field">
        <label className="bank-account-form__label">
          Empresa <span className="bank-account-form__required">*</span>
        </label>
        {isSuperAdmin ? (
          <select
            name="company_id"
            className={`bank-account-form__select ${errors.company_id ? 'bank-account-form__select--error' : ''}`}
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
          <div className="bank-account-form__static">
            {user?.company?.name || 'Mi Empresa'}
          </div>
        )}
        {errors.company_id && <span className="bank-account-form__error">{errors.company_id}</span>}
      </div>
    </form>
  )
}