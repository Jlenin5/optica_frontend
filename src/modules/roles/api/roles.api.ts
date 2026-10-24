import http from "@/services/http"
import type { GetRolesParams, Role, RolePayload } from "../types/roles.types"
import type { Permission } from "@/modules/permissions/types/permissions.types"
import type { PaginatedResponse } from "@/types/global.types"

export const getRoles = async (params?: GetRolesParams): Promise<PaginatedResponse<Role>> => {
  const response = await http.get<PaginatedResponse<Role>>("/roles", {
    params: { limit: params?.limit ?? 10, offset: params?.offset ?? 0, search: params?.search },
  })
  return response.data
}

export const getRoleById = async (id: number): Promise<Role> => {
  const response = await http.get<Role>(`/roles/${id}`)
  return response.data
}

export const createRole = async (data: RolePayload): Promise<Role> => {
  const response = await http.post<Role>("/roles", data)
  return response.data
}

export const updateRole = async (id: number, data: Partial<RolePayload>): Promise<Role> => {
  const response = await http.put<Role>(`/roles/${id}`, data)
  return response.data
}

export const deleteRole = async (id: number) => {
  await http.delete(`/roles/${id}`)
}

export const getRolePermissions = async (id: number): Promise<Permission[]> => {
  const response = await http.get<Permission[]>(`/roles/${id}/permissions`)
  return response.data
}

export const setRolePermissions = async (id: number, permission_ids: number[]) => {
  const response = await http.put(`/roles/${id}/permissions`, { permission_ids })
  return response.data
}
