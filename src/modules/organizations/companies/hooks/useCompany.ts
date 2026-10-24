import { useQuery } from "@tanstack/react-query"
import { getCompanyById } from "../api/companies.api"

export const useCompany = (id: number) => {
  return useQuery({
    queryKey: ["company", id],
    queryFn: () => getCompanyById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}