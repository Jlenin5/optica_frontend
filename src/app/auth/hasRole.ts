import type { User } from "@/modules/users/types/users.types"

export const getUserRoles = (
  user?: Pick<User, "roles" | "role" | "role_id"> | string | null,
): string[] => {
  if (!user) return []
  if (typeof user === "string") return [user]
  const roles = user.roles?.map(role => role.name) ?? []
  if (user.role?.name && !roles.includes(user.role.name)) roles.push(user.role.name)
  return roles
}

export const hasRole = (
  user?: Pick<User, "roles" | "role" | "role_id"> | string | null,
  allowedRoles: string[] = [],
) => getUserRoles(user).some(role => allowedRoles.includes(role))
