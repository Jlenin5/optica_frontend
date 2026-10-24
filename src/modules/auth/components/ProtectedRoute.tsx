import { Navigate } from "react-router-dom"
import { useAuthStore } from "@/app/store/auth.store"
import { useCheckLimits } from "@/hooks/useCheckLimits"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredFeature?: string
  requiredRole?: string[]
  requiredPermission?: string
  requiredPermissions?: string[]
  checkLimit?: { key: string; currentValue: number; redirectTo?: string }
}

export const ProtectedRoute = ({
  children, requiredFeature, requiredRole, requiredPermission,
  requiredPermissions, checkLimit,
}: ProtectedRouteProps) => {
  const {
    isAuthenticated, isInitialized, hasFeature, checkLimit: checkUserLimit,
    hasAnyRole, hasPermission, hasAllPermissions,
  } = useAuthStore()
  const { showLimitWarning } = useCheckLimits()

  if (!isInitialized) return <div className="loading-screen">Cargando...</div>
  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (requiredRole?.length && !hasAnyRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />
  }
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />
  }
  if (requiredPermissions?.length && !hasAllPermissions(requiredPermissions)) {
    return <Navigate to="/unauthorized" replace />
  }
  if (requiredFeature && !hasFeature(requiredFeature)) {
    return <Navigate to="/unauthorized" replace />
  }
  if (checkLimit && !checkUserLimit(checkLimit.key, checkLimit.currentValue)) {
    showLimitWarning(checkLimit.key, checkLimit.redirectTo)
    return <Navigate to={checkLimit.redirectTo || '/'} replace />
  }

  return <>{children}</>
}
