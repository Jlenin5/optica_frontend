import { toast as hotToast, type ToastOptions as HotToastOptions } from "react-hot-toast"
import { toast as sonnerToast } from "sonner"

type ToastProvider = 'hot-toast' | 'sonner'

interface NotificationConfig {
  provider?: ToastProvider
  defaultDuration?: number
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
}

class NotificationService {
  private provider: ToastProvider = 'hot-toast'
  private defaultDuration: number = 4000
  private position: string = 'top-right'

  constructor(config?: NotificationConfig) {
    if (config?.provider) this.provider = config.provider
    if (config?.defaultDuration) this.defaultDuration = config.defaultDuration
    if (config?.position) this.position = config.position
  }

  /**
   * Cambiar el proveedor de notificaciones
   */
  setProvider(provider: ToastProvider) {
    this.provider = provider
  }

  /**
   * Obtener el proveedor actual
   */
  getProvider(): ToastProvider {
    return this.provider
  }

  /**
   * Muestra un mensaje de éxito
   */
  success(message: string, options?: HotToastOptions) {
    if (this.provider === 'sonner') {
      sonnerToast.success(message, {
        duration: options?.duration || this.defaultDuration,
        position: options?.position as any || this.position,
      })
    } else {
      hotToast.success(message, {
        duration: options?.duration || this.defaultDuration,
        position: options?.position as any || this.position,
        ...options,
      })
    }
  }

  /**
   * Muestra un mensaje de error
   */
  error(message: string, options?: HotToastOptions) {
    if (this.provider === 'sonner') {
      sonnerToast.error(message, {
        duration: options?.duration || this.defaultDuration,
        position: options?.position as any || this.position,
      })
    } else {
      hotToast.error(message, {
        duration: options?.duration || this.defaultDuration,
        position: options?.position as any || this.position,
        ...options,
      })
    }
  }

  /**
   * Muestra un mensaje de información
   */
  info(message: string, options?: HotToastOptions) {
    if (this.provider === 'sonner') {
      sonnerToast.info(message, {
        duration: options?.duration || this.defaultDuration,
        position: options?.position as any || this.position,
      })
    } else {
      hotToast(message, {
        duration: options?.duration || this.defaultDuration,
        position: options?.position as any || this.position,
        icon: 'ℹ️',
        ...options,
      })
    }
  }

  /**
   * Muestra un mensaje de advertencia
   */
  warning(message: string, options?: HotToastOptions) {
    if (this.provider === 'sonner') {
      sonnerToast.warning(message, {
        duration: options?.duration || this.defaultDuration,
        position: options?.position as any || this.position,
      })
    } else {
      hotToast(message, {
        duration: options?.duration || this.defaultDuration,
        position: options?.position as any || this.position,
        icon: '⚠️',
        ...options,
      })
    }
  }

  /**
   * Muestra un mensaje de carga y maneja una promesa
   */
  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string
      error: string
    },
    options?: HotToastOptions
  ) {
    if (this.provider === 'sonner') {
      // return sonnerToast.promise(promise, messages, {
      //   duration: options?.duration || this.defaultDuration,
      //   position: options?.position as any || this.position,
      // })
    } else {
      return hotToast.promise(promise, messages, {
        duration: options?.duration || this.defaultDuration,
        position: options?.position as any || this.position,
        ...options,
      })
    }
  }

  /**
   * Muestra un mensaje de carga persistente
   */
  loading(message: string, options?: HotToastOptions): string {
    if (this.provider === 'sonner') {
      // Sonner no tiene loading persistente, usar hot-toast como fallback
      return hotToast.loading(message, {
        duration: options?.duration || this.defaultDuration,
        position: options?.position as any || this.position,
        ...options,
      })
    } else {
      return hotToast.loading(message, {
        duration: options?.duration || this.defaultDuration,
        position: options?.position as any || this.position,
        ...options,
      })
    }
  }

  /**
   * Cierra un toast específico
   */
  dismiss(toastId?: string) {
    if (this.provider === 'sonner') {
      if (toastId) {
        sonnerToast.dismiss(toastId)
      } else {
        sonnerToast.dismiss()
      }
    } else {
      if (toastId) {
        hotToast.dismiss(toastId)
      } else {
        hotToast.dismiss()
      }
    }
  }
}

// Instancia única del servicio
export const notification = new NotificationService()

// Exportar también las funciones directamente para compatibilidad
export const {
  success,
  error,
  info,
  warning,
  promise,
  loading,
  dismiss,
} = notification