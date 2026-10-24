import type { ReactNode } from 'react'

interface ModuleHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  filters?: ReactNode
}

export function ModuleHeader({ title, description, actions, filters }: ModuleHeaderProps) {
  return (
    <>
      <header className="module-page__header">
        <div className="module-page__heading">
          <h1 className="module-page__title">{title}</h1>
          {description && <p className="module-page__description">{description}</p>}
        </div>
        {actions && <div className="module-page__actions">{actions}</div>}
      </header>
      {filters && <div className="module-page__filters">{filters}</div>}
    </>
  )
}
