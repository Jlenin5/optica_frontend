import type { ReactNode } from 'react'
import { ModuleHeader } from './ModuleHeader'

interface ModuleScaffoldProps {
  title: string
  description?: string
  actions?: ReactNode
  filters?: ReactNode
  table: ReactNode
  modal?: ReactNode
}

/** Estructura estándar: header/filtros + tabla/listado + modal opcional. */
export function ModuleScaffold({ title, description, actions, filters, table, modal }: ModuleScaffoldProps) {
  return <section className="module-page"><ModuleHeader title={title} description={description} actions={actions} filters={filters} />{table}{modal}</section>
}
