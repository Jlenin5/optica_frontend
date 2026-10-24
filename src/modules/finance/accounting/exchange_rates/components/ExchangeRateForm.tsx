import { useState } from "react"
import { useAuthStore } from "@/app/store/auth.store"
import { useCompanies } from "@/modules/organizations/companies/hooks/useCompanies"

interface ExchangeRateFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export const ExchangeRateForm = ({ onSubmit, onCancel, isSubmitting }: ExchangeRateFormProps) => {
  const { user, currentCompanyId, isSuperAdmin } = useAuthStore()
  const { data: companiesData, isLoading: companiesLoading } = useCompanies({ status: true })

  const [formData, setFormData] = useState({
    company_id: isSuperAdmin ? "" : currentCompanyId?.toString() || "",
    amount_commercial: "",
    amount_sunat: "",
    amount_sbs: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const companies = companiesData?.results || []

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    const validateAmount = (value: string, fieldName: string) => {
      if (value && isNaN(parseFloat(value))) {
        newErrors[fieldName] = "Ingrese un valor numérico válido"
      } else if (value && parseFloat(value) <= 0) {
        newErrors[fieldName] = "El valor debe ser mayor a 0"
      }
    }
    
    validateAmount(formData.amount_commercial, 'amount_commercial')
    validateAmount(formData.amount_sunat, 'amount_sunat')
    validateAmount(formData.amount_sbs, 'amount_sbs')
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    const submitData = {
      company_id: formData.company_id ? parseFloat(formData.company_id) : null,
      amount_commercial: formData.amount_commercial ? parseFloat(formData.amount_commercial) : null,
      amount_sunat: formData.amount_sunat ? parseFloat(formData.amount_sunat) : null,
      amount_sbs: formData.amount_sbs ? parseFloat(formData.amount_sbs) : null,
    }
    
    onSubmit(submitData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    <form className="exchange-rate-form" onSubmit={handleSubmit}>
      <div className="exchange-rate-form__section">
        <div className="exchange-rate-form__row">
          <div className="exchange-rate-form__field">
            <label className="exchange-rate-form__label">
              Tasa Comercial <span className="bank-account-form__required">*</span>
            </label>
            <input
              type="number"
              name="amount_commercial"
              required
              step="0.0001"
              placeholder="3.5000"
              className={`exchange-rate-form__input ${errors.amount_commercial ? 'exchange-rate-form__input--error' : ''}`}
              value={formData.amount_commercial}
              onChange={handleChange}
            />
            {errors.amount_commercial && <span className="exchange-rate-form__error">{errors.amount_commercial}</span>}
            <p className="exchange-rate-form__helper">Tasa de cambio del mercado comercial</p>
          </div>

          <div className="exchange-rate-form__field">
            <label className="exchange-rate-form__label">
              Tasa SUNAT <span className="bank-account-form__required">*</span>
            </label>
            <input
              type="number"
              name="amount_sunat"
              required
              step="0.0001"
              placeholder="3.5000"
              className={`exchange-rate-form__input ${errors.amount_sunat ? 'exchange-rate-form__input--error' : ''}`}
              value={formData.amount_sunat}
              onChange={handleChange}
            />
            {errors.amount_sunat && <span className="exchange-rate-form__error">{errors.amount_sunat}</span>}
            <p className="exchange-rate-form__helper">Tasa de cambio oficial SUNAT</p>
          </div>
        </div>

        <div className="exchange-rate-form__field">
          <label className="exchange-rate-form__label">
            Tasa SBS <span className="bank-account-form__required">*</span>
          </label>
          <input
            type="number"
            name="amount_sbs"
            required
            step="0.0001"
            placeholder="3.5000"
            className={`exchange-rate-form__input ${errors.amount_sbs ? 'exchange-rate-form__input--error' : ''}`}
            value={formData.amount_sbs}
            onChange={handleChange}
          />
          {errors.amount_sbs && <span className="exchange-rate-form__error">{errors.amount_sbs}</span>}
          <p className="exchange-rate-form__helper">Tasa de cambio de la Superintendencia de Banca y Seguros</p>
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