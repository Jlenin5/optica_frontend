export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'administrador',
  OPTOMETRA: 'optometra',
  RECEPTIONIST: 'RECEPTIONIST',
  SELLER: 'SELLER'
} as const

export type RoleType = typeof ROLES[keyof typeof ROLES]
