import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from "@/app/store/auth.store"
import {
  getCompanySettings,
  getNotificationSettings,
  getSecuritySettings,
  getInvoiceSettings,
  getSystemSettings,
  getBranchOffices,
  getSequences
} from "../api/settings.api"

export const useSettings = () => {
  const { isSuperAdmin } = useAuthStore()

  const company = useQuery({
    queryKey: ["settings", "company"],
    queryFn: getCompanySettings,
    staleTime: 5 * 60 * 1000,
  })

  const notifications = useQuery({
    queryKey: ["settings", "notifications"],
    queryFn: getNotificationSettings,
    staleTime: 5 * 60 * 1000,
  })

  const security = useQuery({
    queryKey: ["settings", "security"],
    queryFn: getSecuritySettings,
    staleTime: 5 * 60 * 1000,
  })

  const invoice = useQuery({
    queryKey: ["settings", "invoice"],
    queryFn: getInvoiceSettings,
    staleTime: 5 * 60 * 1000,
  })

  const seriesOfVouchers = useQuery({
    queryKey: ["settings", "series-of-vouchers"],
    queryFn: () => getSequences(),
    staleTime: 5 * 60 * 1000,
  })

  const system = useQuery({
    queryKey: ["settings", "system"],
    queryFn: getSystemSettings,
    staleTime: 5 * 60 * 1000,
    enabled: isSuperAdmin,
  })

  const branchOffices = useQuery({
    queryKey: ["settings", "branch-offices"],
    queryFn: getBranchOffices,
    staleTime: 5 * 60 * 1000,
  })

  return {
    company,
    notifications,
    security,
    invoice,
    seriesOfVouchers,
    system,
    branchOffices,
    isLoading: company.isLoading ||
              notifications.isLoading ||
              security.isLoading || 
              invoice.isLoading ||
              seriesOfVouchers.isLoading ||
              system.isLoading ||
              branchOffices.isLoading,
    isError: company.isError ||
              notifications.isError ||
              security.isError ||
              invoice.isError ||
              seriesOfVouchers.isError ||
              system.isError ||
              branchOffices.isError
  }
}