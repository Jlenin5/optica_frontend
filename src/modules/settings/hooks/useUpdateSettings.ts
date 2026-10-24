import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  updateCompanySettings,
  updateNotificationSettings,
  updateSecuritySettings,
  updateInvoiceSettings,
  updateSystemSettings,
  uploadCompanyLogo,
  createBranchOffice,
  updateBranchOffice,
  deleteBranchOffice
} from "../api/settings.api"
import { notification } from "@/services/notification"
import type { BackendErrorResponse } from "@/types/global.types"

export const useUpdateCompanySettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCompanySettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "company"] })
      notification.success("Configuración de empresa actualizada")
    },
    onError: (error: BackendErrorResponse) => {
      notification.error(error.response?.data?.message || "Error al actualizar la configuración")
    }
  })
}

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "notifications"] })
      notification.success("Configuración de notificaciones actualizada")
    },
    onError: (error: BackendErrorResponse) => {
      notification.error(error.response?.data?.message || "Error al actualizar la configuración")
    }
  })
}

export const useUpdateSecuritySettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateSecuritySettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "security"] })
      notification.success("Configuración de seguridad actualizada")
    },
    onError: (error: BackendErrorResponse) => {
      notification.error(error.response?.data?.message || "Error al actualizar la configuración")
    }
  })
}

export const useUpdateInvoiceSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateInvoiceSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "invoice"] })
      notification.success("Configuración de facturación actualizada")
    },
    onError: (error: BackendErrorResponse) => {
      notification.error(error.response?.data?.message || "Error al actualizar la configuración")
    }
  })
}

export const useUpdateSystemSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateSystemSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "system"] })
      notification.success("Configuración del sistema actualizada")
    },
    onError: (error: BackendErrorResponse) => {
      notification.error(error.response?.data?.message || "Error al actualizar la configuración")
    }
  })
}

export const useUploadCompanyLogo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadCompanyLogo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "company"] })
      notification.success("Logo actualizado exitosamente")
    },
    onError: (error: BackendErrorResponse) => {
      notification.error(error.response?.data?.message || "Error al subir el logo")
    }
  })
}

// ============ HOOKS PARA SUCURSALES ============

export const useCreateBranchOffice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) => createBranchOffice(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["settings", "branch-offices"] })
      notification.success(`Sucursal "${data.name}" creada exitosamente`)
    },
    onError: (error: BackendErrorResponse) => {
      const message = error.response?.data?.message || "Error al crear la sucursal"
      notification.error(message)
      console.error("Error creating branch office:", error)
    }
  })
}

export const useUpdateBranchOffice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateBranchOffice(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["settings", "branch-offices"] })
      notification.success(`Sucursal "${data.name}" actualizada exitosamente`)
    },
    onError: (error: BackendErrorResponse) => {
      const message = error.response?.data?.message || "Error al actualizar la sucursal"
      notification.error(message)
      console.error("Error updating branch office:", error)
    }
  })
}

export const useDeleteBranchOffice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteBranchOffice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "branch-offices"] })
      notification.success("Sucursal eliminada exitosamente")
    },
    onError: (error: BackendErrorResponse) => {
      const message = error.response?.data?.message || "Error al eliminar la sucursal"
      notification.error(message)
      console.error("Error deleting branch office:", error)
    }
  })
}