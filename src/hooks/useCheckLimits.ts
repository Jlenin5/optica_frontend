import { useAuthStore } from "@/app/store/auth.store"
import { notification } from "@/services/notification"
import { useNavigate } from "react-router-dom"
import { useState, useEffect, useCallback } from "react"

export const useCheckLimits = () => {
  const { getLimitValue, limits, plan, isSuperAdmin } = useAuthStore()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Pequeño timeout para asegurar que los límites están cargados
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const checkLimitBeforeAction = useCallback((limitKey: string, currentValue: number, actionName: string): boolean => {
    // Si es super_admin, no tiene límites
    if (isSuperAdmin) return true
    
    const maxValue = getLimitValue(limitKey)
    
    if (maxValue === null || maxValue === undefined) {
      return true // Sin límite definido
    }
    
    if (currentValue >= maxValue) {
      const limitName = limitKey.replace('max_', '').replace('_', ' ')
      notification.warning(
        `No puedes ${actionName}. Has alcanzado el límite de ${limitName} (${maxValue}). ` +
        `Contacta al administrador para aumentar tu plan.`,
        { duration: 6000 }
      )
      return false
    }
    
    return true
  }, [isSuperAdmin, getLimitValue])

  const showLimitWarning = useCallback((limitKey: string, redirectTo?: string) => {
    if (isSuperAdmin) return
    
    const maxValue = getLimitValue(limitKey)
    const limitName = limitKey.replace('max_', '').replace('_', ' ')
    
    notification.error(
      `Límite de ${limitName} alcanzado. ` +
      `Tu plan ${plan?.name || 'actual'} permite un máximo de ${maxValue}. ` +
      `Para aumentar este límite, contacta al administrador.`,
      { duration: 8000 }
    )
    
    if (redirectTo) {
      setTimeout(() => navigate(redirectTo), 3000)
    }
  }, [isSuperAdmin, getLimitValue, plan, navigate])

  return {
    checkLimitBeforeAction,
    showLimitWarning,
    limits,
    isLoading
  }
}