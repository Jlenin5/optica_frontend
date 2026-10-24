import { useState } from "react"
import { useUpdateSecuritySettings } from "../hooks/useUpdateSettings"
import type { SecuritySettings } from "../types/settings.types"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface SecuritySettingsFormProps {
  settings: SecuritySettings
}

export const SecuritySettingsForm = ({ settings }: SecuritySettingsFormProps) => {
  const [formData, setFormData] = useState({
    two_factor_auth: settings.two_factor_auth,
    session_timeout: settings.session_timeout,
    password_expiry_days: settings.password_expiry_days,
    login_attempts: settings.login_attempts,
    ip_restriction: settings.ip_restriction,
    allowed_ips: settings.allowed_ips?.join(', ') || ''
  })

  const [showIpField, setShowIpField] = useState(settings.ip_restriction)
  const { mutate: updateSettings, isPending } = useUpdateSecuritySettings()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const allowedIps = formData.allowed_ips.split(',').map(ip => ip.trim()).filter(ip => ip)
    updateSettings({
      ...formData,
      allowed_ips: allowedIps.length > 0 ? allowedIps : undefined
    })
  }

  const handleToggle = (name: string) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }))
    if (name === 'ip_restriction') {
      setShowIpField(!showIpField)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          <MuiSvgIcon size={20}>lucide:shield</MuiSvgIcon>
          Autenticación
        </h3>
        
        <label className="settings-form__toggle">
          <input
            type="checkbox"
            name="two_factor_auth"
            checked={formData.two_factor_auth}
            onChange={handleChange}
          />
          <span className="settings-form__toggle-slider"></span>
          <span className="settings-form__toggle-label">Autenticación de dos factores (2FA)</span>
        </label>
        <p className="settings-form__helper">Requiere verificación adicional al iniciar sesión</p>
      </div>

      <div className="settings-form__section">
        <h3 className="settings-form__section-title">
          <MuiSvgIcon size={20}>lucide:clock</MuiSvgIcon>
          Sesión
        </h3>
        
        <div className="settings-form__field">
          <label>Tiempo de sesión (minutos)</label>
          <input
            type="number"
            name="session_timeout"
            value={formData.session_timeout}
            onChange={handleChange}
            min={5}
            max={480}
          />
          <p className="settings-form__helper">Tiempo de inactividad antes de cerrar sesión</p>
        </div>
      </div>

      <div className="settings-form__section">
        <h3 className="settings-form__section-title">
          <MuiSvgIcon size={20}>lucide:key</MuiSvgIcon>
          Contraseñas
        </h3>
        
        <div className="settings-form__field">
          <label>Días para expiración de contraseña</label>
          <input
            type="number"
            name="password_expiry_days"
            value={formData.password_expiry_days}
            onChange={handleChange}
            min={0}
            max={365}
          />
          <p className="settings-form__helper">0 = sin expiración</p>
        </div>

        <div className="settings-form__field">
          <label>Intentos máximos de inicio de sesión</label>
          <input
            type="number"
            name="login_attempts"
            value={formData.login_attempts}
            onChange={handleChange}
            min={3}
            max={10}
          />
          <p className="settings-form__helper">Número de intentos fallidos antes de bloquear la cuenta</p>
        </div>
      </div>

      <div className="settings-form__section">
        <h3 className="settings-form__section-title">
          <MuiSvgIcon size={20}>lucide:globe</MuiSvgIcon>
          Restricción de IP
        </h3>
        
        <label className="settings-form__toggle">
          <input
            type="checkbox"
            name="ip_restriction"
            checked={formData.ip_restriction}
            onChange={handleChange}
          />
          <span className="settings-form__toggle-slider"></span>
          <span className="settings-form__toggle-label">Restringir acceso por IP</span>
        </label>

        {showIpField && (
          <div className="settings-form__field">
            <label>IPs permitidas</label>
            <textarea
              name="allowed_ips"
              value={formData.allowed_ips}
              onChange={handleChange}
              rows={3}
              placeholder="192.168.1.1, 10.0.0.1, 172.16.0.1"
            />
            <p className="settings-form__helper">Separar múltiples IPs con comas</p>
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