import { useQuery } from "@tanstack/react-query"
import { getActiveSession } from "../api/cash-registers.api"

export const useActiveSession = () => {
  return useQuery({
    queryKey: ["cash-register-sessions", "active"],
    queryFn: async () => {
      try {
        const session = await getActiveSession()
        return session
      } catch (error) {
        return null
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    // Elimina initialData para que no interfiera
    // initialData: null,
  })
}