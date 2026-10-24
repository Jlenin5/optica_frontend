/**
 * Permission codes are the source of truth for UI authorization.
 * The backend is still authoritative and validates every request.
 */
export const PERMISSIONS = {
  VIEW: (resource: string) => `${resource}.view`,
  CREATE: (resource: string) => `${resource}.create`,
  UPDATE: (resource: string) => `${resource}.update`,
  DELETE: (resource: string) => `${resource}.delete`,
  MANAGE_PERMISSIONS: "roles.manage_permissions",
} as const

export type PermissionCode = string

export const permission = {
  view: (resource: string) => `${resource}.view`,
  create: (resource: string) => `${resource}.create`,
  update: (resource: string) => `${resource}.update`,
  delete: (resource: string) => `${resource}.delete`,
} as const
