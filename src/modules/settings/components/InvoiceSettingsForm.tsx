import { useState } from "react"
import { useUpdateInvoiceSettings } from "../hooks/useUpdateSettings"
import type { InvoiceSettings } from "../types/settings.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface InvoiceSettingsFormProps {
  settings: InvoiceSettings
}

export const InvoiceSettingsForm = ({ settings }: InvoiceSettingsFormProps) => {
  const [formData, setFormData] = useState({
    default_currency: settings.default_currency,
    tax_rate: settings.tax_rate,
    invoice_prefix: settings.invoice_prefix,
    invoice_series: settings.invoice_series,
    footer_text: settings.footer_text || '',
    terms_conditions: settings.terms_conditions || '',
    logo_on_invoice: settings.logo_on_invoice
  })

  const { mutate: updateSettings, isPending } = useUpdateInvoiceSettings()

  const currencies = [
    { value: 'PEN', label: 'Sol Peruano (PEN)' },
    { value: 'USD', label: 'Dólar Americano (USD)' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'tax_rate' ? parseFloat(value) : value
    }))
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <div className="settings-form__section">
        <h3 className="settings-form__section-title">
          <MuiSvgIcon size={20}>lucide:credit-card</MuiSvgIcon>
          Configuración General
        </h3>
        
        <div className="settings-form__grid">
          <div className="settings-form__field">
            <label>Moneda por defecto</label>
            <select
              name="default_currency"
              value={formData.default_currency}
              onChange={handleChange}
            >
              {currencies.map(currency => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
          </div>

          <div className="settings-form__field">
            <label>Tasa de impuesto (%)</label>
            <input
              type="number"
              name="tax_rate"
              value={formData.tax_rate}
              onChange={handleChange}
              step="0.01"
              min={0}
              max={100}
            />
          </div>
        </div>
      </div>

      <div className="settings-form__section">
        <h3 className="settings-form__section-title">
          <MuiSvgIcon size={20}>lucide:hash</MuiSvgIcon>
          Numeración
        </h3>
        
        <div className="settings-form__grid">
          <div className="settings-form__field">
            <label>Prefijo de factura</label>
            <input
              type="text"
              name="invoice_prefix"
              value={formData.invoice_prefix}
              onChange={handleChange}
              placeholder="F"
            />
          </div>

          <div className="settings-form__field">
            <label>Serie de factura</label>
            <input
              type="text"
              name="invoice_series"
              value={formData.invoice_series}
              onChange={handleChange}
              placeholder="001"
            />
          </div>
        </div>
      </div>

      <div className="settings-form__section">
        <h3 className="settings-form__section-title">
          <MuiSvgIcon size={20}>lucide:file-text</MuiSvgIcon>
          Textos Adicionales
        </h3>
        
        <div className="settings-form__field settings-form__field--full">
          <label>Texto de pie de página</label>
          <textarea
            name="footer_text"
            value={formData.footer_text}
            onChange={handleChange}
            rows={3}
            placeholder="Gracias por su compra..."
          />
        </div>

        <div className="settings-form__field settings-form__field--full">
          <label>Términos y condiciones</label>
          <textarea
            name="terms_conditions"
            value={formData.terms_conditions}
            onChange={handleChange}
            rows={4}
            placeholder="Términos y condiciones de la factura..."
          />
        </div>
      </div>

      <div className="settings-form__section">
        <h3 className="settings-form__section-title">
          <MuiSvgIcon size={20}>lucide:image</MuiSvgIcon>
          Apariencia
        </h3>
        
        <label className="settings-form__toggle">
          <input
            type="checkbox"
            name="logo_on_invoice"
            checked={formData.logo_on_invoice}
            onChange={handleChange}
          />
          <span className="settings-form__toggle-slider"></span>
          <span className="settings-form__toggle-label">Mostrar logo en facturas</span>
        </label>
      </div>

      <div className="settings-form__actions">
        <button type="submit" className="settings-form__btn settings-form__btn--primary" disabled={isPending}>
          {isPending ? (
            <>
              <span className="settings-form__spinner"></span>
              Guardando...
            </>
          ) : (
            'Guardar Cambios'
          )}
        </button>
      </div>
    </form>
  )
}