import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSale } from "../api/sales.api";
import type { CreateSaleDTO } from "../types/sales.types";

export const useCreateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSaleDTO) => createSale(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["sales-stats"] });
    },
  });
};