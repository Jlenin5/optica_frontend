import { useQuery } from "@tanstack/react-query";
import { getSaleStats } from "../api/sales.api";

export const useSaleStats = (params?: { company_id?: number; store_id?: number; date_from?: string; date_to?: string }) => {
  return useQuery({
    queryKey: ["sales-stats", params],
    queryFn: () => getSaleStats(params),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};