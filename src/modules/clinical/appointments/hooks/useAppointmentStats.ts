import { useQuery } from "@tanstack/react-query"
import { getAppointmentStats } from "../api/appointments.api"

export const useAppointmentStats = () => {
  return useQuery({
    queryKey: ["appointments", "stats"],
    queryFn: getAppointmentStats,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}