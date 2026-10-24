import { useInfiniteQuery } from "@tanstack/react-query"
import http from "@/services/http"
import type { Consultation } from "../types/consultations.types"

interface ConsultationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Consultation[];
}

interface UseConsultationsParams {
  search?: string;
  medical_record_id?: number;
  patient_id?: number;
  appointment_id?: number;
  status?: string;
  page?: number;
  page_size?: number;
}

interface UseConsultationsOptions {
  // Por defecto la lista está habilitada (uso general en ConsultationsPage).
  // Los hooks que dependen de un id que puede no estar listo aún
  // (usePatientConsultations, filtros por cita, etc.) pueden pasar
  // enabled=false explícitamente mientras ese id se resuelve.
  enabled?: boolean;
}

export const useConsultations = (
  params: UseConsultationsParams = {},
  options: UseConsultationsOptions = {}
) => {
  return useInfiniteQuery<ConsultationsResponse>({
    queryKey: ["consultations", params],
    queryFn: async ({ pageParam = 1 }) => {
      const searchParams: any = { ...params, page: pageParam }

      // Limpiar parámetros undefined
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] === undefined) {
          delete searchParams[key]
        }
      })

      const { data } = await http.get("/consultations/", {
        params: searchParams
      })
      return data
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next)
        return url.searchParams.get("page")
      }
      return undefined
    },
    initialPageParam: 1,
    enabled: options.enabled !== undefined ? options.enabled : true
  })
}
