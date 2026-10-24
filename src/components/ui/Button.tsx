import { type ButtonHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'
import { PermissionGate } from '@/components/auth/PermissionGate'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  isLoading?: boolean
  permission?: string
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600',
  secondary: 'bg-white text-ink-900 border border-surface-border hover:bg-surface',
  ghost: 'bg-transparent text-ink-900 hover:bg-surface',
  danger: 'bg-state-danger text-white hover:opacity-90',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', isLoading, permission, className, children, disabled, ...props }, ref) => {
    const button = (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60',
          VARIANT_CLASSES[variant],
          className,
        )}
        {...props}
      >
        {isLoading ? 'Cargando…' : children}
      </button>
    )

    return permission ? <PermissionGate permission={permission}>{button}</PermissionGate> : button
  },
)

Button.displayName = 'Button'
