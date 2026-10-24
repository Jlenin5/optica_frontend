import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSequences,
  createSequence,
  updateSequence,
  deleteSequence,
} from "../api/settings.api";
import { notification } from "@/services/notification";
import type { CreateSequenceDTO, GetSequencesParams, UpdateSequenceDTO } from "../types/settings.types";
import type { BackendErrorResponse } from "@/types/global.types";

// Hook para obtener todas las secuencias
export const useSequences = (params?: GetSequencesParams) => {
  return useQuery({
    queryKey: ["settings", "sequences"],
    queryFn: () => getSequences(params),
  });
};

// Hook para crear secuencia
export const useCreateSequence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSequenceDTO) => createSequence(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "sequences"] });
      // notification.success(`Secuencia "${data.serie}" creada exitosamente`);
    },
    onError: (error: BackendErrorResponse) => {
      const message = error.response?.data?.message || "Error al crear la secuencia";
      notification.error(message);
      console.error("Error creating sequence:", error);
    },
  });
};

// Hook para actualizar secuencia
export const useUpdateSequence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSequenceDTO }) =>
      updateSequence(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["settings", "sequences"] });
      notification.success(`Secuencia "${data.serie}" actualizada`);
    },
    onError: (error: BackendErrorResponse) => {
      const message = error.response?.data?.message || "Error al actualizar la secuencia";
      notification.error(message);
      console.error("Error updating sequence:", error);
    },
  });
};

// Hook para eliminar secuencia
export const useDeleteSequence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteSequence(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "sequences"] });
      notification.success("Secuencia eliminada exitosamente");
    },
    onError: (error: BackendErrorResponse) => {
      const message = error.response?.data?.message || "Error al eliminar la secuencia";
      notification.error(message);
      console.error("Error deleting sequence:", error);
    },
  });
};