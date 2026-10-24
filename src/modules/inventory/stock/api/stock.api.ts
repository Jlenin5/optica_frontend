import http from "@/services/http";
import type {
  StockItem,
  StockStats,
  StockFilters,
  StockMovement,
  MovementFilters,
  PaginatedResponse,
  CreateStockMovementDTO,
  CreateStockTransferDTO,
} from "../types/stock.types";

const query = (params?: Record<string, unknown>) => {
  const p = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== false
    )
      p.append(key, String(value));
  });
  return p.toString() ? `?${p.toString()}` : "";
};
export const getStock = async (params?: StockFilters) =>
  (await http.get<PaginatedResponse<StockItem>>(`/stock${query(params)}`)).data;
export const getStockStats = async (company_id?: number) =>
  (await http.get<StockStats>(`/stock/stats${query({ company_id })}`)).data;
export const getStockMovements = async (params?: MovementFilters) =>
  (
    await http.get<PaginatedResponse<StockMovement>>(
      `/stock/movements${query(params)}`,
    )
  ).data;
export const createStockMovement = async (data: CreateStockMovementDTO) =>
  (await http.post<StockMovement>("/stock/movements", data)).data;
export const createStockTransfer = async (data: CreateStockTransferDTO) =>
  (await http.post("/stock/transfers", data)).data;
export const getProductStock = async (
  productId: number,
  params?: { warehouse_id?: number; store_id?: number },
) =>
  (await http.get<StockItem[]>(`/stock/product/${productId}${query(params)}`))
    .data;