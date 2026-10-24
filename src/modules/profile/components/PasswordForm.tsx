import { useState } from "react"
import MuiSvgIcon from '@components/MuiSvgIcon'

interface PasswordFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  isSubmitting: boolean
}

export const PasswordForm = ({ onSubmit, onCancel, isSubmitting }: PasswordFormProps) => {
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.current_password) {
      newErrors.current_password = "La contraseña actual es requerida"
    }
    
    if (!formData.new_password) {
      newErrors.new_password = "La nueva contraseña es requerida"
    } else if (formData.new_password.length < 6) {
      newErrors.new_password = "La contraseña debe tener al menos 6 caracteres"
    }
    
    if (!formData.confirm_password) {
      newErrors.confirm_password = "Debe confirmar la nueva contraseña"
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = "Las contraseñas no coinciden"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="profile-form__section">
        <h3 className="profile-form__section-title">Cambiar Contraseña</h3>
        
        <div className="profile-form__field">
          <label className="profile-form__label">
            Contraseña Actual <span className="profile-form__required">*</span>
          </label>
          <div className="profile-form__password-wrapper">
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="current_password"
              className={`profile-form__input ${errors.current_password ? 'profile-form__input--error' : ''}`}
              value={formData.current_password}
              onChange={handleChange}
              placeholder="••••••"
            />
            <button
              type="button"
              className="profile-form__password-toggle"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              <MuiSvgIcon size={18}>
                {showCurrentPassword ? 'lucide:eye-off' : 'lucide:eye'}
              </MuiSvgIcon>
            </button>
          </div>
          {errors.current_password && <span className="profile-form__error">{errors.current_password}</span>}
        </div>

        <div className="profile-form__field">
          <label className="profile-form__label">
            Nueva Contraseña <span className="profile-form__required">*</span>
          </label>
          <div className="profile-form__password-wrapper">
            <input
              type={showNewPassword ? "text" : "password"}
              name="new_password"
              className={`profile-form__input ${errors.new_password ? 'profile-form__input--error' : ''}`}
              value={formData.new_password}
              onChange={handleChange}
              placeholder="••••••"
            />
            <button
              type="button"
              className="profile-form__password-toggle"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              <MuiSvgIcon size={18}>
                {showNewPassword ? 'lucide:eye-off' : 'lucide:eye'}
              </MuiSvgIcon>
            </button>
          </div>
          {errors.new_password && <span className="profile-form__error">{errors.new_password}</span>}
        </div>

        <div className="profile-form__field">
          <label className="profile-form__label">
            Confirmar Nueva Contraseña <span className="profile-form__required">*</span>
          </label>
          <div className="profile-form__password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirm_password"
              className={`profile-form__input ${errors.confirm_password ? 'profile-form__input--error' : ''}`}
              value={formData.confirm_password}
              onChange={handleChange}
              placeholder="••••••"
            />
            <button
              type="button"
              className="profile-form__password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <MuiSvgIcon size={18}>
                {showConfirmPassword ? 'lucide:eye-off' : 'lucide:eye'}
              </MuiSvgIcon>
            </button>
          </div>
          {errors.confirm_password && <span className="profile-form__error">{errors.confirm_password}</span>}
        </div>
      </div>

      <div className="profile-form__actions">
        <button
          type="button"
          className="profile-form__btn profile-form__btn--secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="profile-form__btn profile-form__btn--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="profile-form__spinner"></span>
              Cambiando...
            </>
          ) : (
            'Cambiar Contraseña'
          )}
        </button>
      </div>
    </form>
  )
}