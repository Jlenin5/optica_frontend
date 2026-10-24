import { useQuery } from "@tanstack/react-query"
import { getCalendarEvents } from "../api/appointments.api"

export const useCalendarEvents = (start: string, end: string) => {
  return useQuery({
    queryKey: ["appointments", "calendar", start, end],
    queryFn: () => getCalendarEvents(start, end),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}