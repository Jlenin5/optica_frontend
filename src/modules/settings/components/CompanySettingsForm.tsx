import { useState, useRef } from "react"
import { useUpdateCompanySettings, useUploadCompanyLogo } from "../hooks/useUpdateSettings"
import type { CompanySettings } from "../types/settings.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

const api = import.meta.env.VITE_MEDIA_BASE_URL

interface CompanySettingsFormProps {
  settings: CompanySettings
}

export const CompanySettingsForm = ({ settings }: CompanySettingsFormProps) => {
  const [formData, setFormData] = useState({
    name: settings.name || "",
    email: settings.email || "",
    phone: settings.phone || "",
    address: settings.address || "",
    website: settings.website || "",
    einvoice_username: settings.einvoice_username || "",
    einvoice_token: settings.einvoice_token || ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { mutate: updateSettings, isPending } = useUpdateCompanySettings()
  const { mutate: uploadLogo, isPending: isUploading } = useUploadCompanyLogo()

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "El nombre de la empresa es requerido"
    }
    
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "El email no es válido"
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
    updateSettings(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleLogoClick = () => {
    fileInputRef.current?.click()
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("El archivo no debe exceder los 2MB")
        return
      }
      if (!file.type.startsWith('image/')) {
        alert("Solo se permiten imágenes")
        return
      }
      uploadLogo(file)
    }
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <div className="settings-form__section">
        <h3 className="settings-form__section-title">
          <MuiSvgIcon size={20}>lucide:building-2</MuiSvgIcon>
          Información de la Empresa
        </h3>
        
        <div className="settings-form__logo">
          <div className="settings-form__logo-preview" onClick={handleLogoClick}>
            {settings.logo ? (
              <img src={api+settings.logo} alt={settings.name} />
            ) : (
              <div className="settings-form__logo-placeholder">
                <MuiSvgIcon size={32}>lucide:building-2</MuiSvgIcon>
              </div>
            )}
            <div className="settings-form__logo-overlay">
              <MuiSvgIcon size={20}>lucide:camera</MuiSvgIcon>
              <span>Cambiar logo</span>
            </div>
            {isUploading && (
              <div className="settings-form__logo-loading">
                <div className="settings-form__spinner"></div>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            style={{ display: 'none' }}
          />
          <p className="settings-form__helper">
            Tamaño recomendado: 200x200px. Máximo 2MB.
          </p>
        </div>

        <div className="settings-form__grid">
          <div className="settings-form__field">
            <label>Nombre de la empresa *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="settings-form__error">{errors.name}</span>}
          </div>

          <div className="settings-form__field">
            <label>RUC</label>
            <input type="text" value={settings.ruc} disabled className="settings-form__input--disabled" />
            <p className="settings-form__helper">El RUC no puede ser modificado</p>
          </div>

          <div className="settings-form__field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="settings-form__error">{errors.email}</span>}
          </div>

          <div className="settings-form__field">
            <label>Teléfono</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="settings-form__error">{errors.phone}</span>}
          </div>

          <div className="settings-form__field settings-form__field--full">
            <label>Dirección</label>
            <input
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="settings-form__field settings-form__field--full">
            <label>Sitio Web</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://www.ejemplo.com"
            />
          </div>
        </div>
      </div>

      <div className="settings-form__section">
        <h3 className="settings-form__section-title">
          <MuiSvgIcon size={20}>lucide:file-text</MuiSvgIcon>
          Facturación Electrónica
        </h3>
        
        <div className="settings-form__grid">
          <div className="settings-form__field">
            <label>Usuario SUNAT</label>
            <input
              type="text"
              name="einvoice_username"
              value={formData.einvoice_username}
              onChange={handleChange}
            />
          </div>

          <div className="settings-form__field">
            <label>Token SUNAT</label>
            <input
              type="password"
              name="einvoice_token"
              value={formData.einvoice_token}
              onChange={handleChange}
            />
          </div>
        </div>
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