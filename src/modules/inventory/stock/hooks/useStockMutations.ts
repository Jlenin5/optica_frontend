import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStockMovement, createStockTransfer } from "../api/stock.api";
import type {
  CreateStockMovementDTO,
  CreateStockTransferDTO,
} from "../types/stock.types";
const refresh = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: ["stock"] });
  qc.invalidateQueries({ queryKey: ["stock-movements"] });
  qc.invalidateQueries({ queryKey: ["products"] });
};
export const useCreateStockMovement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: CreateStockMovementDTO) => createStockMovement(d),
    onSuccess: () => refresh(qc),
  });
};
export const useCreateStockTransfer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: CreateStockTransferDTO) => createStockTransfer(d),
    onSuccess: () => refresh(qc),
  });
};