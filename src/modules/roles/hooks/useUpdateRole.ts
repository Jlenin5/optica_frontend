import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateRole } from "../api/roles.api"
import type { RolePayload } from "../types/roles.types"

export const useUpdateRole = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<RolePayload> }) => 
      updateRole(id, data),
    onSuccess: (_, variables) => {
      // Invalidar la lista de usuarios y el usuario específico
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      queryClient.invalidateQueries({ queryKey: ["roles", variables.id] })
    },
    onError: (error: Error) => {
      console.error("Error updating role:", error.message)
    },
  })
}