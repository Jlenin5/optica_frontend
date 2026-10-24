import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getStock,
  getStockMovements,
  getStockStats,
  getProductStock,
} from "../api/stock.api";
import type { StockFilters, MovementFilters } from "../types/stock.types";
import { useAuthStore } from "@/app/store/auth.store";
export const useStock = (filters?: Omit<StockFilters, "limit" | "offset">) => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore();
  const company = !isSuperAdmin ? currentCompanyId : undefined;
  return useInfiniteQuery({
    queryKey: ["stock", { ...filters, company_id: company }],
    queryFn: ({ pageParam = 0 }) =>
      getStock({
        ...filters,
        company_id: company,
        offset: pageParam,
        limit: 50,
      }),
    getNextPageParam: (p) => (p.has_more ? p.next_offset : undefined),
    initialPageParam: 0,
    staleTime: 30_000,
  });
};
export const useStockMovements = (
  filters?: Omit<MovementFilters, "limit" | "offset">,
) => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore();
  const company = !isSuperAdmin ? currentCompanyId : undefined;
  return useInfiniteQuery({
    queryKey: ["stock-movements", { ...filters, company_id: company }],
    queryFn: ({ pageParam = 0 }) =>
      getStockMovements({
        ...filters,
        company_id: company,
        offset: pageParam,
        limit: 50,
      }),
    getNextPageParam: (p) => (p.has_more ? p.next_offset : undefined),
    initialPageParam: 0,
    staleTime: 30_000,
  });
};
export const useStockStats = () => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore();
  return useQuery({
    queryKey: ["stock", "stats", isSuperAdmin ? undefined : currentCompanyId],
    queryFn: () => getStockStats(isSuperAdmin ? undefined : currentCompanyId),
    staleTime: 30_000,
  });
};
export const useProductStock = (productId?: number) =>
  useQuery({
    queryKey: ["stock", "product", productId],
    queryFn: () => getProductStock(productId!),
    enabled: !!productId,
    staleTime: 15_000,
  });