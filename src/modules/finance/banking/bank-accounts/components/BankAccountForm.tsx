import { useState, useEffect } from "react"
import { useBanks } from "@/modules/finance/banking/banks/hooks/useBanks"
import { useCurrencies } from "@/modules/finance/accounting/currencies/hooks/useCurrencies"
import { useCompanies } from "@/modules/organizations/companies/hooks/useCompanies"
import { useAuthStore } from "@/app/store/auth.store"
import type { BankAccount } from "../types/bank-accounts.types"

interface BankAccountFormProps {
  onSubmit: (data: any) => void
  initialData?: BankAccount | null
  onCancel: () => void
  isEditing: boolean
  isSubmitting?: boolean
}

export const BankAccountForm = ({ 
  onSubmit, 
  initialData, 
  onCancel, 
  isEditing,
  isSubmitting 
}: BankAccountFormProps) => {
  const { user, currentCompanyId, isSuperAdmin } = useAuthStore()
  const { data: banksData, isLoading: banksLoading } = useBanks()
  const { data: currenciesData, isLoading: currenciesLoading } = useCurrencies()
  const { data: companiesData, isLoading: companiesLoading } = useCompanies({ status: true })
  
  const [formData, setFormData] = useState({
    description: "",
    bank_id: "",
    company_id: "",
    currency_id: "",
    account_number: "",
    cci_number: "",
    diary: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const banks = banksData?.pages.flatMap(page => page.results) || []
  const currencies = currenciesData?.pages.flatMap(page => page.results) || []
  const companies = companiesData?.results || []

  useEffect(() => {
    if (initialData) {
      setFormData({
        description: initialData.description || "",
        bank_id: initialData.bank_id?.toString() || "",
        company_id: initialData.company_id?.toString() || "",
        currency_id: initialData.currency_id?.toString() || "",
        account_number: initialData.account_number || "",
        cci_number: initialData.cci_number || "",
        diary: initialData.diary || "",
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
    
    if (!formData.bank_id) {
      newErrors.bank_id = "Debe seleccionar un banco"
    }
    
    // if (!formData.company_id) {
    //   newErrors.company_id = "Debe seleccionar una empresa"
    // }
    
    if (formData.account_number && formData.account_number.length > 30) {
      newErrors.account_number = "El número de cuenta no puede exceder 20 caracteres"
    }
    
    if (formData.cci_number && formData.cci_number.length > 30) {
      newErrors.cci_number = "El CCI no puede exceder 20 caracteres"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    const submitData = {
      description: formData.description || null,
      bank_id: parseInt(formData.bank_id),
      company_id: parseInt(formData.company_id),
      currency_id: formData.currency_id ? parseInt(formData.currency_id) : null,
      account_number: formData.account_number || null,
      cci_number: formData.cci_number || null,
      diary: formData.diary || null,
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

  if (banksLoading || currenciesLoading || companiesLoading) {
    return (
      <div className="bank-account-form__loading">
        <div className="bank-account-form__spinner"></div>
        <p>Cargando datos...</p>
      </div>
    )
  }

  return (
    <form className="bank-account-form" onSubmit={handleSubmit}>
      <div className="bank-account-form__section">
        <div className="bank-account-form__row">
          <div className="bank-account-form__field">
            <label className="bank-account-form__label">
              Banco <span className="bank-account-form__required">*</span>
            </label>
            <select
              name="bank_id"
              className={`bank-account-form__select ${errors.bank_id ? 'bank-account-form__select--error' : ''}`}
              value={formData.bank_id}
              onChange={handleChange}
            >
              <option value="">Seleccionar banco</option>
              {banks.map(bank => (
                <option key={bank.id} value={bank.id}>
                  {bank.name}
                </option>
              ))}
            </select>
            {errors.bank_id && <span className="bank-account-form__error">{errors.bank_id}</span>}
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
        </div>

        <div className="bank-account-form__row">
          <div className="bank-account-form__field">
            <label className="bank-account-form__label">Moneda</label>
            <select
              name="currency_id"
              className="bank-account-form__select"
              value={formData.currency_id}
              onChange={handleChange}
            >
              <option value="">Seleccionar moneda</option>
              {currencies.map(currency => (
                <option key={currency.id} value={currency.id}>
                  {currency.name} ({currency.code})
                </option>
              ))}
            </select>
          </div>

          <div className="bank-account-form__field">
            <label className="bank-account-form__label">Número de Cuenta</label>
            <input
              type="text"
              name="account_number"
              placeholder="Ej: 12345678901234567890"
              className={`bank-account-form__input ${errors.account_number ? 'bank-account-form__input--error' : ''}`}
              value={formData.account_number}
              onChange={handleChange}
            />
            {errors.account_number && <span className="bank-account-form__error">{errors.account_number}</span>}
          </div>
        </div>

        <div className="bank-account-form__row">
          <div className="bank-account-form__field">
            <label className="bank-account-form__label">CCI</label>
            <input
              type="text"
              name="cci_number"
              placeholder="Ej: 12345678901234567890123456789012"
              className={`bank-account-form__input ${errors.cci_number ? 'bank-account-form__input--error' : ''}`}
              value={formData.cci_number}
              onChange={handleChange}
            />
            {errors.cci_number && <span className="bank-account-form__error">{errors.cci_number}</span>}
          </div>

          <div className="bank-account-form__field">
            <label className="bank-account-form__label">Diario</label>
            <input
              type="text"
              name="diary"
              placeholder="Ej: 01"
              className="bank-account-form__input"
              value={formData.diary}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="bank-account-form__field">
          <label className="bank-account-form__label">Descripción</label>
          <textarea
            name="description"
            className="bank-account-form__textarea"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Descripción de la cuenta bancaria..."
          />
        </div>
      </div>
    </form>
  )
}