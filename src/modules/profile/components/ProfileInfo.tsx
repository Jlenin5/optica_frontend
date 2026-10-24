import { useRef } from "react"
import type { Profile } from "../types/profile.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { hasRole } from "@/app/auth/hasRole"
import { ROLES } from "@/app/auth/roles"

interface ProfileInfoProps {
  profile: Profile
  onEdit: () => void
  onUploadAvatar: (file: File) => void
  isUploading: boolean
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd 'de' MMMM yyyy", { locale: es })
}

export const ProfileInfo = ({ profile, onEdit, onUploadAvatar, isUploading }: ProfileInfoProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      onUploadAvatar(file)
    }
  }

  const canViewPlan = hasRole(profile.role?.name, [
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN
  ])

  const getInitials = () => {
    return `${profile.username?.charAt(0).toUpperCase() || ''}`
  }

  return (
    <div className="profile-info">
      <div className="profile-info__avatar-section">
        <div className="profile-info__avatar-wrapper" onClick={handleAvatarClick}>
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.username}
              className="profile-info__avatar"
            />
          ) : (
            <div className="profile-info__avatar-placeholder">
              {getInitials()}
            </div>
          )}
          <div className="profile-info__avatar-overlay">
            <MuiSvgIcon size={24}>lucide:camera</MuiSvgIcon>
            <span>Cambiar foto</span>
          </div>
          {isUploading && (
            <div className="profile-info__avatar-loading">
              <div className="profile-info__spinner"></div>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button className="profile-info__edit-btn" onClick={onEdit}>
          <MuiSvgIcon size={18}>
            heroicons-outline:pencil-square
          </MuiSvgIcon>
          Editar Perfil
        </button>
      </div>

      <div className="profile-info__details">
        <div className="profile-info__section">
          <h3 className="profile-info__section-title">Información Personal</h3>
          <div className="profile-info__grid">
            <div className="profile-info__item">
              <span className="profile-info__label">Nombre de usuario</span>
              <span className="profile-info__value">{profile.username}</span>
            </div>
            <div className="profile-info__item">
              <span className="profile-info__label">Email</span>
              <span className="profile-info__value">{profile.email}</span>
            </div>
            <div className="profile-info__item">
              <span className="profile-info__label">Rol</span>
              <span className="profile-info__value">
                <span className={`profile-info__role-badge profile-info__role-badge--${profile.role?.name?.toLowerCase() || 'user'}`}>
                  {profile.role?.name || 'Usuario'}
                </span>
              </span>
            </div>
            <div className="profile-info__item">
              <span className="profile-info__label">Estado</span>
              <span className="profile-info__value">
                <span className={`profile-info__status-badge profile-info__status-badge--${profile.status ? 'active' : 'inactive'}`}>
                  {profile.status ? 'Activo' : 'Inactivo'}
                </span>
              </span>
            </div>
            <div className="profile-info__item">
              <span className="profile-info__label">Fecha de registro</span>
              <span className="profile-info__value">{formatDate(profile.created_at)}</span>
            </div>
          </div>
        </div>

        {profile.company && (
          <div className="profile-info__section">
            <h3 className="profile-info__section-title">Información de la Empresa</h3>
            <div className="profile-info__grid">
              <div className="profile-info__item">
                <span className="profile-info__label">Empresa</span>
                <span className="profile-info__value">{profile.company.name}</span>
              </div>
              <div className="profile-info__item">
                <span className="profile-info__label">RUC</span>
                <span className="profile-info__value">{profile.company.ruc}</span>
              </div>
              {profile.company.phone && (
                <div className="profile-info__item">
                  <span className="profile-info__label">Teléfono</span>
                  <span className="profile-info__value">{profile.company.phone}</span>
                </div>
              )}
              {profile.company.email && (
                <div className="profile-info__item">
                  <span className="profile-info__label">Email</span>
                  <span className="profile-info__value">{profile.company.email}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {profile.plan && canViewPlan && (
          <div className="profile-info__section">
            <h3 className="profile-info__section-title">Plan Actual</h3>
            <div className="profile-info__plan">
              <div className="profile-info__plan-icon">
                <MuiSvgIcon size={24}>lucide:crown</MuiSvgIcon>
              </div>
              <div className="profile-info__plan-info">
                <div className="profile-info__plan-name">{profile.plan.name}</div>
                {profile.features && profile.features.length > 0 && (
                  <div className="profile-info__plan-features">
                    <span className="profile-info__plan-features-label">Módulos:</span>
                    <div className="profile-info__plan-features-list">
                      {profile.features.map((feature, index) => (
                        <span key={index} className="profile-info__plan-feature">
                          <MuiSvgIcon size={12}>lucide:check</MuiSvgIcon>
                          {feature.replace(/módulo de\s*/gi, '')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.limits && Object.keys(profile.limits).length > 0 && (
                  <div className="profile-info__plan-limits">
                    <span className="profile-info__plan-limits-label">Límites:</span>
                    <div className="profile-info__plan-limits-list">
                      {Object.entries(profile.limits).map(([key, value]) => (
                        <span key={key} className="profile-info__plan-limit">
                          {key.replace('Máximo de', '').replace(/_/g, ' ')}: {value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}