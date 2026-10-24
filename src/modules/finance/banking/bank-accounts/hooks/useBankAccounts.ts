import { useInfiniteQuery } from "@tanstack/react-query"
import { getBankAccounts } from "../api/bank-accounts.api"
import type { GetBankAccountsParams } from "../types/bank-accounts.types"
import { useAuthStore } from "@/app/store/auth.store"

export const useBankAccounts = (filters?: Omit<GetBankAccountsParams, 'offset' | 'limit'>) => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  
  const companyFilter = !isSuperAdmin && currentCompanyId ? { company_id: currentCompanyId } : {}
  
  return useInfiniteQuery({
    queryKey: ["bank-accounts", { ...filters, ...companyFilter }],
    queryFn: ({ pageParam = 0 }) => 
      getBankAccounts({ 
        ...filters, 
        ...companyFilter,
        offset: pageParam, 
        limit: 20 
      }),
    getNextPageParam: (lastPage) => lastPage.has_more ? lastPage.next_offset : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}