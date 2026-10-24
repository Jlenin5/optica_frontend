import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteStatus } from "../api/statuses.api"

export const useDeleteStatus = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deleteStatus,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["statuses"] })
    },
  })
}