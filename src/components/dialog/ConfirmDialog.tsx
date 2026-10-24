import { AppModal } from '@/components/ui/modal'
import { useEffect, useRef } from 'react'
import MuiSvgIcon from '@/components/MuiSvgIcon'
import '@/styles/confirm-dialog.scss'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

const variantConfig = {
  danger: { icon: 'lucide:alert-triangle', tone: 'danger' },
  warning: { icon: 'lucide:alert-circle', tone: 'warning' },
  info: { icon: 'lucide:info', tone: 'info' },
} as const

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) => {
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const config = variantConfig[variant]

  useEffect(() => {
    if (isOpen) confirmButtonRef.current?.focus()
  }, [isOpen])

  if (!isOpen) return null

  return (
    <AppModal
      title={title}
      onClose={onClose}
      size="sm"
      closeOnOverlay={false}
      closeOnEscape={false}
      closeDisabled={isLoading}
      footer={
        <>
          <button type="button" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            className={`confirm-dialog__confirm confirm-dialog__confirm--${config.tone}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? <span className="confirm-dialog__spinner" /> : <MuiSvgIcon size={16}>{config.icon}</MuiSvgIcon>}
            {isLoading ? 'Procesando...' : confirmText}
          </button>
        </>
      }
    >
      <div className={`confirm-dialog__content confirm-dialog__content--${config.tone}`}>
        <div className="confirm-dialog__icon"><MuiSvgIcon size={22}>{config.icon}</MuiSvgIcon></div>
        <p className="confirm-dialog__message">{message}</p>
      </div>
    </AppModal>
  )
}
