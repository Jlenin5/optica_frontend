import MuiSvgIcon from "@/components/MuiSvgIcon"
import { useEffect, useState } from "react"

interface UserLimitWarningProps {
  maxUsers: number
  currentCount: number
  usagePercentage: number
  planName?: string
  isSuperAdmin?: boolean
  onClose?: () => void
}

export const UserLimitWarning = ({ 
  maxUsers,
  currentCount,
  usagePercentage,
  planName,
  isSuperAdmin = false,
  onClose
}: UserLimitWarningProps) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isDismissed, setIsDismissed] = useState(false)

  if (isSuperAdmin) return null

  if (isDismissed) return null

  if (!maxUsers || maxUsers === 0 || currentCount === undefined) return null

  const isCritical = usagePercentage >= 95
  const isWarning = usagePercentage >= 80
  const remainingUsers = maxUsers - currentCount

  useEffect(() => {
    if (!isCritical && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [isCritical, isVisible])

  const handleDismiss = () => {
    setIsDismissed(true)
    onClose?.()
  }

  if (isSuperAdmin) return null
  if (isDismissed) return null
  if (!isVisible) return null
  if (!maxUsers || maxUsers === 0 || currentCount === undefined) return null

  return (
    <div className={`user-limit-warning user-limit-warning--${isCritical ? 'critical' : isWarning ? 'warning' : 'info'} animate-slide-in`}>
      <div className="user-limit-warning__icon">
        <MuiSvgIcon size={24}>
          {isCritical ? 'lucide:alert-triangle' : 'lucide:info'}
        </MuiSvgIcon>
      </div>
      <div className="user-limit-warning__content">
        <div className="user-limit-warning__title">
          {isCritical ? '¡Límite de usuarios casi alcanzado!' : 'Cerca del límite de usuarios'}
        </div>
        <div className="user-limit-warning__message">
          Has utilizado <strong>{currentCount}</strong> de <strong>{maxUsers}</strong> usuarios disponibles 
          en el plan <strong>{planName || 'actual'}</strong>.
          {remainingUsers > 0 && (
            <> Te quedan <strong>{remainingUsers}</strong> usuario{remainingUsers !== 1 ? 's' : ''} disponible{remainingUsers !== 1 ? 's' : ''}.</>
          )}
          {remainingUsers === 0 && (
            <> No puedes crear más usuarios hasta que actualices tu plan.</>
          )}
        </div>
        <div className="user-limit-warning__progress">
          <div className="user-limit-warning__progress-bar">
            <div 
              className="user-limit-warning__progress-fill" 
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          <span className="user-limit-warning__percentage">{Math.round(usagePercentage)}%</span>
        </div>
        {isCritical && (
          <div className="user-limit-warning__action">
            <button className="user-limit-warning__button" onClick={() => {
              // Aquí puedes redirigir a la página de planes o contacto
              window.location.href = '/billing/plans'
            }}>
              Actualizar Plan
            </button>
          </div>
        )}
      </div>
      <button className="user-limit-warning__close" onClick={handleDismiss} aria-label="Cerrar">
        <MuiSvgIcon size={16}>lucide:x</MuiSvgIcon>
      </button>
    </div>
  )
}