import type { ButtonHTMLAttributes, ReactNode } from "react"
import { PermissionGate } from "./PermissionGate"

interface PermissionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  permission: string
  children: ReactNode
}

export function PermissionButton({ permission, children, ...props }: PermissionButtonProps) {
  return (
    <PermissionGate permission={permission}>
      <button {...props}>{children}</button>
    </PermissionGate>
  )
}
