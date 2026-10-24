import { useInfiniteQuery } from "@tanstack/react-query";
import { getSales } from "../api/sales.api";
import type { SaleFilters } from "../types/sales.types";

export const useSales = (filters: SaleFilters = {}) => {
  return useInfiniteQuery({
    queryKey: ["sales", filters],
    queryFn: ({ pageParam = 0 }) => {
      const offset = pageParam * (filters.limit || 20);
      return getSales({ ...filters, offset });
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.next) {
        return pages.length;
      }
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};