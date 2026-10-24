import { useEffect, useRef, type ReactNode } from 'react'
import MuiSvgIcon from '@/components/MuiSvgIcon'
import '@/styles/components/_modal.scss'

interface AppModalProps {
  title: string
  description?: string
  headerContent?: ReactNode
  children: ReactNode
  footer?: ReactNode
  onClose: () => void
  size?: 'sm' | 'md' | 'lg'
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
  closeDisabled?: boolean
}

export function AppModal({
  title,
  description,
  headerContent,
  children,
  footer,
  onClose,
  size = 'md',
  closeOnOverlay = false,
  closeOnEscape = true,
  closeDisabled = false,
}: AppModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape && !closeDisabled) onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, closeOnEscape, closeDisabled])

  const handleOverlayMouseDown = () => {
    if (closeOnOverlay && !closeDisabled) onClose()
  }

  return (
    <div className="app-modal-overlay" role="presentation" onMouseDown={handleOverlayMouseDown}>
      <section
        className={`app-modal app-modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="app-modal__header">
          {headerContent ?? (
            <div className="app-modal__heading">
              <h2 className="app-modal__title">{title}</h2>
              {description && <p className="app-modal__description">{description}</p>}
            </div>
          )}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="app-modal__close"
            disabled={closeDisabled}
            aria-label="Cerrar"
          >
            <MuiSvgIcon size={19}>lucide:x</MuiSvgIcon>
          </button>
        </header>
        <div className="app-modal__body">{children}</div>
        {footer && <footer className="app-modal__footer">{footer}</footer>}
      </section>
    </div>
  )
}
