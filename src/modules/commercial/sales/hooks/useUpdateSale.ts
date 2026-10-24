import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSale } from "../api/sales.api";
import type { CreateSaleDTO } from "../types/sales.types";

export const useUpdateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateSaleDTO }) =>
      updateSale(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["sales", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["sales-stats"] });
    },
  });
};