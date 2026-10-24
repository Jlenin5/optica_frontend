import { useState, useEffect } from "react"
import type { Profile } from "../types/profile.types"

interface ProfileFormProps {
  profile: Profile
  onSubmit: (data: any) => void
  onCancel: () => void
  isSubmitting: boolean
}

export const ProfileForm = ({ profile, onSubmit, onCancel, isSubmitting }: ProfileFormProps) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setFormData({
      username: profile.username || "",
      email: profile.email || "",
    })
  }, [profile])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido"
    } else if (formData.username.length < 3) {
      newErrors.username = "El nombre de usuario debe tener al menos 3 caracteres"
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "El email no es válido"
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
        <h3 className="profile-form__section-title">Editar Información Personal</h3>
        
        <div className="profile-form__field">
          <label className="profile-form__label">
            Nombre de usuario <span className="profile-form__required">*</span>
          </label>
          <input
            type="text"
            name="username"
            className={`profile-form__input ${errors.username ? 'profile-form__input--error' : ''}`}
            value={formData.username}
            onChange={handleChange}
            placeholder="usuario123"
          />
          {errors.username && <span className="profile-form__error">{errors.username}</span>}
        </div>

        <div className="profile-form__field">
          <label className="profile-form__label">
            Email <span className="profile-form__required">*</span>
          </label>
          <input
            type="email"
            name="email"
            className={`profile-form__input ${errors.email ? 'profile-form__input--error' : ''}`}
            value={formData.email}
            onChange={handleChange}
            placeholder="ejemplo@optica.com"
          />
          {errors.email && <span className="profile-form__error">{errors.email}</span>}
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