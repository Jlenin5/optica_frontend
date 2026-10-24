import { useQuery } from "@tanstack/react-query"
import { getAppointmentById } from "../api/appointments.api"
import type { Appointment } from "../types/appointments.types"

export const useAppointment = (id: number) => {
  return useQuery({
    queryKey: ["appointments", id],
    queryFn: () => getAppointmentById(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}