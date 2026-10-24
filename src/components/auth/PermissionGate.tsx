import type { ReactNode } from "react"
import { usePermissions } from "@/hooks/usePermissions"

interface PermissionGateProps {
  permission?: string
  anyOf?: string[]
  allOf?: string[]
  fallback?: ReactNode
  children: ReactNode
}

/** UI guard. Never replaces backend authorization. */
export function PermissionGate({
  permission,
  anyOf,
  allOf,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions()

  const allowed =
    (!permission || hasPermission(permission)) &&
    (!anyOf?.length || hasAnyPermission(anyOf)) &&
    (!allOf?.length || hasAllPermissions(allOf))

  return allowed ? <>{children}</> : <>{fallback}</>
}
