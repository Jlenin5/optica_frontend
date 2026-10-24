import { useQuery } from "@tanstack/react-query"
import { getActiveCashRegister } from "../api/cash-registers.api"
import { AxiosError } from "axios"

export const useActiveCashRegister = () => {
  return useQuery({
    queryKey: ["cash-registers", "active"],
    queryFn: getActiveCashRegister,
    staleTime: 5 * 60 * 1000,
    retry: false,
    // No mostrar error en consola para 404
    throwOnError: (error) => {
      // Si es 404, no es un error real (solo significa que no hay caja activa)
      if (error instanceof AxiosError && error.response?.status === 404) {
        return false
      }
      return true
    },
  })
}