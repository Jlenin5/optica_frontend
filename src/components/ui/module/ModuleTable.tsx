import type { ReactNode } from 'react'

interface ModuleTableProps { children: ReactNode; className?: string }
export function ModuleTable({ children, className = '' }: ModuleTableProps) {
  return <div className={`ui-table-container ${className}`.trim()}>{children}</div>
}
