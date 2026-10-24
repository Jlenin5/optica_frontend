import { useState } from "react"
import { useUpdateSystemSettings } from "../hooks/useUpdateSettings"
import type { SystemSettings } from "../types/settings.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface SystemSettingsFormProps {
  settings: SystemSettings
}

export const SystemSettingsForm = ({ settings }: SystemSettingsFormProps) => {
  const [formData, setFormData] = useState({
    timezone: settings.timezone,
    date_format: settings.date_format,
    time_format: settings.time_format,
    language: settings.language,
    maintenance_mode: settings.maintenance_mode,
    maintenance_message: settings.maintenance_message || ''
  })

  const [showMaintenanceMessage, setShowMaintenanceMessage] = useState(settings.maintenance_mode)
  const { mutate: updateSettings, isPending } = useUpdateSystemSettings()

  const timezones = [
    { value: 'America/Lima', label: 'Lima (Perú)' },
    { value: 'America/Bogota', label: 'Bogotá (Colombia)' },
    { value: 'America/Mexico_City', label: 'Ciudad de México (México)' },
    { value: 'America/Santiago', label: 'Santiago (Chile)' },
    { value: 'America/Buenos_Aires', label: 'Buenos Aires (Argentina)' },
    { value: 'America/Caracas', label: 'Caracas (Venezuela)' }
  ]

  const dateFormats = [
    { value: 'dd/MM/yyyy', label: '31/12/2024' },
    { value: 'yyyy-MM-dd', label: '2024-12-31' },
    { value: 'MM/dd/yyyy', label: '12/31/2024' },
    { value: 'dd-MM-yyyy', label: '31-12-2024' }
  ]

  const timeFormats = [
    { value: 'HH:mm', label: '14:30' },
    { value: 'hh:mm a', label: '02:30 PM' },
    { value: 'HH:mm:ss', label: '14:30:45' }
  ]

  const languages = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'pt', label: 'Português' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings(formData)
  }

  const handleToggle = () => {
    setFormData(prev => ({ ...prev, maintenance_mode: !prev.maintenance_mode }))
    setShowMaintenanceMessage(!showMaintenanceMessage)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <div className="settings-form__section">
        <h3 className="settings-form__section-title">
          <MuiSvgIcon size={20}>lucide:clock</MuiSvgIcon>
          Regionalización
        </h3>
        
        <div className="settings-form__grid">
          <div className="settings-form__field">
            <label>Zona Horaria</label>
            <select name="timezone" value={formData.timezone} onChange={handleChange}>
              {timezones.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>

          <div className="settings-form__field">
            <label>Formato de Fecha</label>
            <select name="date_format" value={formData.date_format} onChange={handleChange}>
              {dateFormats.map(df => (
                <option key={df.value} value={df.value}>{df.label}</option>
              ))}
            </select>
          </div>

          <div className="settings-form__field">
            <label>Formato de Hora</label>
            <select name="time_format" value={formData.time_format} onChange={handleChange}>
              {timeFormats.map(tf => (
                <option key={tf.value} value={tf.value}>{tf.label}</option>
              ))}
            </select>
          </div>

          <div className="settings-form__field">
            <label>Idioma</label>
            <select name="language" value={formData.language} onChange={handleChange}>
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="settings-form__section">
        <h3 className="settings-form__section-title">
          <MuiSvgIcon size={20}>lucide:tools</MuiSvgIcon>
          Mantenimiento
        </h3>
        
        <label className="settings-form__toggle">
          <input
            type="checkbox"
            name="maintenance_mode"
            checked={formData.maintenance_mode}
            onChange={handleToggle}
          />
          <span className="settings-form__toggle-slider"></span>
          <span className="settings-form__toggle-label">Activar modo mantenimiento</span>
        </label>
        <p className="settings-form__helper">
          Cuando está activo, solo los administradores pueden acceder al sistema
        </p>

        {showMaintenanceMessage && (
          <div className="settings-form__field settings-form__field--full">
            <label>Mensaje de mantenimiento</label>
            <textarea
              name="maintenance_message"
              value={formData.maintenance_message}
              onChange={handleChange}
              rows={3}
              placeholder="El sistema se encuentra en mantenimiento. Por favor, intente más tarde."
            />
          </div>
        )}
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