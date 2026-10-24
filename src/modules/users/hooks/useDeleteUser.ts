import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteUser } from "../api/users.api"
import { notification } from "@/services/notification"

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["users", "stats"] })
      notification.success("Usuario eliminado exitosamente")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar el usuario"
      notification.error(message)
      console.error("Error deleting user:", error)
    },
  })
}