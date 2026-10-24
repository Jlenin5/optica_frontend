import { useQuery } from "@tanstack/react-query"
import { getCompanies } from "../api/companies.api"
import type { GetCompaniesParams } from "../types/companies.types"

export const useCompanies = (filters?: GetCompaniesParams) => {
  return useQuery({
    queryKey: ["companies", filters],
    queryFn: () => getCompanies(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
    placeholderData: (previousData) => previousData,
  })
}