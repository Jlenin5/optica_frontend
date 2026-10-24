import { useAuthStore } from "@/app/store/auth.store"

export const usePermissions = () => {
  const {
    permissions, isSuperAdmin, hasPermission, hasAnyPermission,
    hasAllPermissions, hasRole, hasAnyRole,
  } = useAuthStore()

  return {
    permissions,
    isSuperAdmin,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    canView: (resource: string) => hasPermission(`${resource}.view`),
    canCreate: (resource: string) => hasPermission(`${resource}.create`),
    canUpdate: (resource: string) => hasPermission(`${resource}.update`),
    canDelete: (resource: string) => hasPermission(`${resource}.delete`),
  }
}
