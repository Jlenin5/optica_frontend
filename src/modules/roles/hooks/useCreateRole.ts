import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createRole } from "../api/roles.api"
import type { RolePayload } from "../types/roles.types"

export const useCreateRole = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: RolePayload) => createRole(data),
    onSuccess: () => {
      // Invalidar y refetch la lista de usuarios
      queryClient.invalidateQueries({ queryKey: ["roles"] })
    },
    onError: (error: Error) => {
      console.error("Error creating role:", error.message)
    },
  })
}