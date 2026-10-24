import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/modules/auth/hooks/useAuth"
import { useAuthStore } from "@/app/store/auth.store"
import { getRoutePermission } from "@/app/config/routePermissions"

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isInitialized } = useAuth()
  const hasPermission = useAuthStore((s) => s.hasPermission)
  const location = useLocation()

  if (!isInitialized) return <p>Cargando sesión...</p>
  if (!isAuthenticated) return <Navigate to="/login" replace />

  const requiredPermission = getRoutePermission(location.pathname)
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace state={{ requiredPermission }} />
  }

  return <>{children}</>
}
