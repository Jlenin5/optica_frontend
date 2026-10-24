import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSale } from "../api/sales.api";

export const useDeleteSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteSale(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["sales-stats"] });
    },
  });
};