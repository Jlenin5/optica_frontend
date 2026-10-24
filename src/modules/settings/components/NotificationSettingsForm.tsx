import { useState } from "react"
import { useUpdateNotificationSettings } from "../hooks/useUpdateSettings"
import type { NotificationSettings } from "../types/settings.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface NotificationSettingsFormProps {
  settings: NotificationSettings
}

export const NotificationSettingsForm = ({ settings }: NotificationSettingsFormProps) => {
  const [formData, setFormData] = useState({
    email_notifications: settings.email_notifications,
    appointment_reminders: settings.appointment_reminders,
    appointment_reminder_hours: settings.appointment_reminder_hours,
    invoice_notifications: settings.invoice_notifications,
    stock_alerts: settings.stock_alerts,
    low_stock_threshold: settings.low_stock_threshold,
    system_updates: settings.system_updates,
    promotional_emails: settings.promotional_emails
  })

  const { mutate: updateSettings, isPending } = useUpdateNotificationSettings()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings(formData)
  }

  // const handleToggle = (name: string) => {
  //   setFormData(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }))
  // }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : Number(value)
    }))
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <div className="settings-form__section">
        <h3 className="settings-form__section-title">
          <MuiSvgIcon size={20}>lucide:bell</MuiSvgIcon>
          Notificaciones por Email
        </h3>
        
        <div className="settings-form__toggle-list">
          <label className="settings-form__toggle">
            <input
              type="checkbox"
              name="email_notifications"
              checked={formData.email_notifications}
              onChange={handleChange}
            />
            <span className="settings-form__toggle-slider"></span>
            <span className="settings-form__toggle-label">Activar notificaciones por email</span>
          </label>

          <div className="settings-form__field">
            <label>Horas de anticipación para recordatorios</label>
            <input
              type="number"
              name="appointment_reminder_hours"
              value={formData.appointment_reminder_hours}
              onChange={handleChange}
              min={1}
              max={72}
              disabled={!formData.appointment_reminders}
            />
            <p className="settings-form__helper">Número de horas antes de la cita para enviar recordatorio</p>
          </div>
        </div>
      </div>

      <div className="settings-form__section">
        <h3 className="settings-form__section-title">
          <MuiSvgIcon size={20}>lucide:calendar-check</MuiSvgIcon>
          Recordatorios de Citas
        </h3>
        
        <label className="settings-form__toggle">
          <input
            type="checkbox"
            name="appointment_reminders"
            checked={formData.appointment_reminders}
            onChange={handleChange}
          />
          <span className="settings-form__toggle-slider"></span>
          <span className="settings-form__toggle-label">Enviar recordatorios de citas</span>
        </label>
      </div>

      <div className="settings-form__section">
        <h3 className="settings-form__section-title">
          <MuiSvgIcon size={20}>lucide:file-text</MuiSvgIcon>
          Notificaciones de Facturación
        </h3>
        
        <label className="settings-form__toggle">
          <input
            type="checkbox"
            name="invoice_notifications"
            checked={formData.invoice_notifications}
            onChange={handleChange}
          />
          <span className="settings-form__toggle-slider"></span>
          <span className="settings-form__toggle-label">Notificar cuando se genere una factura</span>
        </label>
      </div>

      <div className="settings-form__section">
        <h3 className="settings-form__section-title">
          <MuiSvgIcon size={20}>lucide:package</MuiSvgIcon>
          Alertas de Inventario
        </h3>
        
        <label className="settings-form__toggle">
          <input
            type="checkbox"
            name="stock_alerts"
            checked={formData.stock_alerts}
            onChange={handleChange}
          />
          <span className="settings-form__toggle-slider"></span>
          <span className="settings-form__toggle-label">Activar alertas de stock bajo</span>
        </label>

        <div className="settings-form__field">
          <label>Umbral de stock bajo</label>
          <input
            type="number"
            name="low_stock_threshold"
            value={formData.low_stock_threshold}
            onChange={handleChange}
            min={1}
            disabled={!formData.stock_alerts}
          />
          <p className="settings-form__helper">Cantidad mínima para considerar stock bajo</p>
        </div>
      </div>

      <div className="settings-form__section">
        <h3 className="settings-form__section-title">
          <MuiSvgIcon size={20}>lucide:settings</MuiSvgIcon>
          Otras Notificaciones
        </h3>
        
        <label className="settings-form__toggle">
          <input
            type="checkbox"
            name="system_updates"
            checked={formData.system_updates}
            onChange={handleChange}
          />
          <span className="settings-form__toggle-slider"></span>
          <span className="settings-form__toggle-label">Recibir actualizaciones del sistema</span>
        </label>

        <label className="settings-form__toggle">
          <input
            type="checkbox"
            name="promotional_emails"
            checked={formData.promotional_emails}
            onChange={handleChange}
          />
          <span className="settings-form__toggle-slider"></span>
          <span className="settings-form__toggle-label">Recibir correos promocionales</span>
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