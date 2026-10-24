import http from "@/services/http"
import type { Permission, EffectivePermissionsResponse } from "../types/permissions.types"

export const getPermissions = async (params?: { search?: string; limit?: number; offset?: number }) => {
  const response = await http.get<{ results: Permission[]; count: number }>("/permissions", {
    params: { limit: params?.limit ?? 500, offset: params?.offset ?? 0, search: params?.search },
  })
  return response.data
}

export const getMyPermissions = async (): Promise<EffectivePermissionsResponse> => {
  const response = await http.get<EffectivePermissionsResponse>("/permissions/me")
  return response.data
}
