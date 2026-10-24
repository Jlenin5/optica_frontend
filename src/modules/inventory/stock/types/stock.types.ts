export type StockLocationType = "warehouse" | "store";
export type StockMovementType =
  | "entry"
  | "exit"
  | "adjustment"
  | "transfer_in"
  | "transfer_out"
  | "sale"
  | "return";

export interface StockLocation {
  id: number;
  name: string;
  type: StockLocationType;
  company_id?: number | null;
  status?: boolean;
}
export interface StockItem {
  id: number;
  product_id: number;
  product_name: string;
  product_sku?: string | null;
  product_type?: "product" | "lens" | "service";
  product_image?: string | null;
  warehouse_id?: number | null;
  warehouse_name?: string | null;
  store_id?: number | null;
  store_name?: string | null;
  location_type: StockLocationType;
  location_id: number;
  quantity: number;
  reserved_quantity?: number;
  available_quantity?: number;
  min_stock?: number;
  max_stock?: number | null;
  updated_at?: string;
}
export interface StockMovement {
  id: number;
  product_id: number;
  product_name?: string;
  movement_type: StockMovementType;
  quantity: number;
  previous_quantity?: number;
  resulting_quantity?: number;
  warehouse_id?: number | null;
  warehouse_name?: string | null;
  store_id?: number | null;
  store_name?: string | null;
  reference?: string | null;
  notes?: string | null;
  created_at: string;
  created_by?: { id: number; username: string };
}
export interface StockStats {
  total_products: number;
  total_units: number;
  low_stock: number;
  out_of_stock: number;
  total_value?: number;
}
export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  limit: number;
  has_more: boolean;
  next_offset: number;
  next_after_id?: number | null;
}
export interface StockFilters {
  limit?: number;
  offset?: number;
  search?: string;
  company_id?: number;
  warehouse_id?: number;
  store_id?: number;
  low_stock?: boolean;
  out_of_stock?: boolean;
  product_id?: number;
}
export interface MovementFilters extends StockFilters {
  movement_type?: StockMovementType;
  date_from?: string;
  date_to?: string;
}
export interface CreateStockMovementDTO {
  product_id: number;
  movement_type: "entry" | "exit" | "adjustment" | "return";
  quantity: number;
  warehouse_id?: number | null;
  store_id?: number | null;
  reference?: string | null;
  notes?: string | null;
}
export interface CreateStockTransferDTO {
  product_id: number;
  quantity: number;
  from_warehouse_id?: number | null;
  from_store_id?: number | null;
  to_warehouse_id?: number | null;
  to_store_id?: number | null;
  notes?: string | null;
}
