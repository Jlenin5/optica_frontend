import { useState } from "react"
import { useReceipts } from "@receipts/hooks/useReceipts"
import { useAuthStore } from "@/app/store/auth.store"
import { useCompanies } from "@companies/hooks/useCompanies"
import type { TypeOfReceipt } from "../types/type-of-receipts.types"

interface TypeOfReceiptFormProps {
  onSubmit: (data: any) => void
  initialData?: TypeOfReceipt | null
  onCancel: () => void
  isEditing: boolean
  isSubmitting?: boolean
}

export const TypeOfReceiptForm = ({ 
  onSubmit, 
  initialData, 
  onCancel, 
  isEditing,
  isSubmitting 
}: TypeOfReceiptFormProps) => {
  const { user, currentCompanyId, isSuperAdmin } = useAuthStore()

  const { data: companiesData, isLoading: companiesLoading } = useCompanies({
    limit: 10,
    offset: 0,
    status: true
  })
  const { data: receiptsData, isLoading: receiptsLoading } = useReceipts({ status: true })
  
  const [formData, setFormData] = useState({
    description: initialData?.description || '',
    receipt_id: initialData?.receipt_id || '',
    serie: initialData?.serie || '',
    correlative: initialData?.correlative || '',
    company_id: isSuperAdmin ? "" : currentCompanyId?.toString() || "",
    status: initialData?.status ?? true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const companies = companiesData?.results || []
  const receipts = receiptsData?.pages.flatMap(page => page.results) || []

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.description) {
      newErrors.serie = 'Debe ingresar al menos una serie o una descripción'
    }

    if (formData.serie && formData.serie.length > 4) {
      newErrors.serie = 'La serie no puede tener más de 4 caracteres'
    }

    // if (formData.correlative && (formData.correlative < 1 || formData.correlative > 99999999)) {
    //   newErrors.correlative = 'El correlativo debe estar entre 1 y 99,999,999'
    // }

    if (formData.receipt_id && !formData.receipt_id) {
      newErrors.receipt_id = 'Seleccione un recibo'
    }

    if (formData.company_id && !formData.company_id) {
      newErrors.company_id = 'Seleccione una empresa'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    const submitData = {
      description: formData.description || null,
      receipt_id: formData.receipt_id ? Number(formData.receipt_id) : null,
      serie: formData.serie || null,
      correlative: formData.correlative ? Number(formData.correlative) : null,
      company_id: formData.company_id ? Number(formData.company_id) : null,
      status: formData.status
    }

    onSubmit(submitData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (receiptsLoading || companiesLoading) {
    return (
      <div className="type-of-receipt-form__loading">
        <div className="type-of-receipt-form__spinner"></div>
        <p>Cargando datos...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="type-of-receipt-form">
      <div className="type-of-receipt-form__section">
        <div className="type-of-receipt-form__row">
          <div className="type-of-receipt-form__field">
            <label htmlFor="description">
              Descripción <span className="bank-form__required">*</span>
            </label>
            <input
              id="description"
              name="description"
              type="text"
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción del tipo de recibo..."
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="type-of-receipt-form__error">{errors.description}</span>}
          </div>

          <div className="type-of-receipt-form__field">
            <label htmlFor="serie">
              Serie <span className="bank-form__required">*</span>
            </label>
            <input
              id="serie"
              name="serie"
              type="text"
              value={formData.serie}
              onChange={handleChange}
              placeholder="F001"
              maxLength={4}
              className={errors.serie ? 'error' : ''}
            />
            {errors.serie && <span className="type-of-receipt-form__error">{errors.serie}</span>}
            <p className="type-of-receipt-form__helper">
              Serie del comprobante (máximo 4 caracteres)
            </p>
          </div>
        </div>

        <div className="type-of-receipt-form__row">
          <div className="type-of-receipt-form__field">
            <label htmlFor="correlative">Correlativo Inicial</label>
            <input
              type="number"
              id="correlative"
              name="correlative"
              value={formData.correlative}
              onChange={handleChange}
              placeholder="1"
              min="1"
              max="99999999"
              className={errors.correlative ? 'error' : ''}
            />
            {errors.correlative && <span className="type-of-receipt-form__error">{errors.correlative}</span>}
            <p className="type-of-receipt-form__helper">
              Número correlativo inicial para este tipo de recibo
            </p>
          </div>

          <div className="type-of-receipt-form__field">
            <label htmlFor="receipt_id">Recibo Asociado</label>
            <select
              id="receipt_id"
              name="receipt_id"
              value={formData.receipt_id}
              onChange={handleChange}
              className={errors.receipt_id ? 'error' : ''}
            >
              <option value="">Seleccione un recibo</option>
              {receipts.map(receipt => (
                <option key={receipt.id} value={receipt.id}>
                  {receipt.description}
                </option>
              ))}
            </select>
            {errors.receipt_id && <span className="type-of-receipt-form__error">{errors.receipt_id}</span>}
          </div>
        </div>

        <div className="type-of-receipt-form__row">
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

          {isEditing && (
            <div className="type-of-receipt-form__field type-of-receipt-form__field--checkbox">
              <label className="type-of-receipt-form__checkbox">
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                />
                <span>Tipo de Recibo Activo</span>
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="type-of-receipt-form__actions">
        <button 
          type="button" 
          className="type-of-receipt-form__cancel" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className="type-of-receipt-form__submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="type-of-receipt-form__spinner"></span>
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