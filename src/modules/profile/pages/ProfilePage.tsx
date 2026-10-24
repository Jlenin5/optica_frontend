import { useState } from "react"
import { useProfile } from "../hooks/useProfile"
import { useUpdateProfile } from "../hooks/useUpdateProfile"
import { useChangePassword } from "../hooks/useChangePassword"
import { useUploadAvatar } from "../hooks/useUploadAvatar"
import { ProfileForm } from "../components/ProfileForm"
import { PasswordForm } from "../components/PasswordForm"
import { ProfileInfo } from "../components/ProfileInfo"
import { ProfileSkeleton } from "../components/ProfileSkeleton"
import "@styles/profile.scss"
import MuiSvgIcon from "@/components/MuiSvgIcon"

type TabType = 'info' | 'edit' | 'password'

export const ProfilePage = () => {
  const { data: profile, isLoading, refetch } = useProfile()
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile()
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword()
  const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar()
  const [activeTab, setActiveTab] = useState<TabType>('info')

  const handleUpdateProfile = (data: any) => {
    updateProfile(data, {
      onSuccess: () => {
        refetch()
        setActiveTab('info')
      }
    })
  }

  const handleChangePassword = (data: any) => {
    changePassword(data, {
      onSuccess: () => {
        setActiveTab('info')
      }
    })
  }

  const handleUploadAvatar = (file: File) => {
    uploadAvatar(file)
  }

  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (!profile) {
    return (
      <div className="profile-error">
        <div className="profile-error__content">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 8V12M12 16H12.01M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <h2>Error al cargar el perfil</h2>
          <p>No se pudo cargar la información del usuario</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <h1 className="profile-page__title">Mi Perfil</h1>
        <p className="profile-page__subtitle">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      <div className="profile-page__tabs">
        <button
          className={`profile-tab ${activeTab === 'info' ? 'profile-tab--active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          <MuiSvgIcon size={18}>
            lucide:user
          </MuiSvgIcon>
          Información
        </button>
        <button
          className={`profile-tab ${activeTab === 'edit' ? 'profile-tab--active' : ''}`}
          onClick={() => setActiveTab('edit')}
        >
          <MuiSvgIcon size={18}>
            heroicons-outline:pencil-square
          </MuiSvgIcon>
          Editar Perfil
        </button>
        <button
          className={`profile-tab ${activeTab === 'password' ? 'profile-tab--active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          <MuiSvgIcon size={18}>
            lucide:key
          </MuiSvgIcon>
          Cambiar Contraseña
        </button>
      </div>

      <div className="profile-page__content">
        {activeTab === 'info' && (
          <ProfileInfo
            profile={profile}
            onEdit={() => setActiveTab('edit')}
            onUploadAvatar={handleUploadAvatar}
            isUploading={isUploading}
          />
        )}
        
        {activeTab === 'edit' && (
          <ProfileForm
            profile={profile}
            onSubmit={handleUpdateProfile}
            onCancel={() => setActiveTab('info')}
            isSubmitting={isUpdating}
          />
        )}
        
        {activeTab === 'password' && (
          <PasswordForm
            onSubmit={handleChangePassword}
            onCancel={() => setActiveTab('info')}
            isSubmitting={isChangingPassword}
          />
        )}
      </div>
    </div>
  )
}