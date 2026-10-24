import { useQuery } from "@tanstack/react-query"
import { getCashRegisterById } from "../api/cash-registers.api"

export const useCashRegister = (id: number) => {
  return useQuery({
    queryKey: ["cash-register", id],
    queryFn: () => getCashRegisterById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}