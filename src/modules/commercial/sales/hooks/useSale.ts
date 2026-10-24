import { useQuery } from "@tanstack/react-query";
import { getSaleById } from "../api/sales.api";

export const useSale = (id: number) => {
  return useQuery({
    queryKey: ["sales", id],
    queryFn: () => getSaleById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};