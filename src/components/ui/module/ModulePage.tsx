import type { ReactNode } from 'react'
import '@/styles/components/_page.scss'

interface ModulePageProps { title: string; description?: string; actions?: ReactNode; children: ReactNode }
export function ModulePage({ title, description, actions, children }: ModulePageProps) {
  return <section className="module-page"><header className="module-page__header"><div className="module-page__heading"><h1 className="module-page__title">{title}</h1>{description && <p className="module-page__description">{description}</p>}</div>{actions && <div className="module-page__actions">{actions}</div>}</header>{children}</section>
}
