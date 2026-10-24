import { useMemo, useState } from 'react'
import type React from 'react'
import MuiSvgIcon from '@/components/MuiSvgIcon'
import { CatalogModal } from './CatalogModal'
import { ModulePagination } from '@/components/ui/module/ModulePagination'

type Column<T> = { label: string; render: (row: T) => React.ReactNode }

interface Props<T> {
  title: string
  description?: string
  items: T[]
  columns: Column<T>[]
  searchPlaceholder?: string
  loading?: boolean
  empty?: string
  onAdd: () => void
  onEdit: (row: T) => void
  onDelete: (row: T) => void
  modalTitle: string
  modalDescription?: string
  modalSize?: 'sm' | 'md' | 'lg'
  renderForm: () => React.ReactNode
  renderFooter: (close: () => void) => React.ReactNode
}

export function CatalogPage<T extends { id: number }>({
  title,
  description = 'Catálogo de configuración del módulo de laboratorio.',
  items,
  columns,
  searchPlaceholder = 'Buscar…',
  loading,
  empty = 'No hay registros',
  onAdd,
  onEdit,
  onDelete,
  modalTitle,
  modalDescription,
  modalSize = 'md',
  renderForm,
  renderFooter,
}: Props<T>) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return items
    return items.filter(item => JSON.stringify(item).toLowerCase().includes(term))
  }, [items, search])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visibleItems = filtered.slice(page * pageSize, (page + 1) * pageSize)

  const startAdd = () => {
    onAdd()
    setOpen(true)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(0)
  }

  const startEdit = (row: T) => {
    onEdit(row)
    setOpen(true)
  }

  const close = () => setOpen(false)

  return (
    <div className="lab-page">
      <header className="lab-page__header">
        <div>
          <div className="lab-page__eyebrow">
            <MuiSvgIcon size={15}>lucide:settings-2</MuiSvgIcon>
            Configuración
          </div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <button type="button" className="add-button" onClick={startAdd}>
          <MuiSvgIcon size={18}>lucide:plus</MuiSvgIcon>
          Agregar
        </button>
      </header>

      <section className="lab-filters" aria-label="Filtros">
        <div className="lab-filters__search">
          <MuiSvgIcon size={17}>lucide:search</MuiSvgIcon>
          <input
            aria-label={`Buscar ${title.toLowerCase()}`}
            placeholder={searchPlaceholder}
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="lab-search__clear"
              onClick={() => setSearch('')}
              aria-label="Limpiar búsqueda"
            >
              <MuiSvgIcon size={15}>lucide:x</MuiSvgIcon>
            </button>
          )}
        </div>
        <span className="lab-results-count">
          {filtered.length} {filtered.length === 1 ? 'registro' : 'registros'}
        </span>
      </section>

      {loading ? (
        <div className="lab-empty">
          <span className="lab-spinner" />
          <strong>Cargando registros</strong>
          <p>Estamos obteniendo la información del catálogo.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="lab-empty">
          <span className="lab-empty__icon">
            <MuiSvgIcon size={30}>lucide:inbox</MuiSvgIcon>
          </span>
          <strong>{search ? 'No se encontraron coincidencias' : empty}</strong>
          <p>{search ? 'Prueba con otro término de búsqueda.' : 'Agrega el primer registro para comenzar.'}</p>
          {!search && (
            <button type="button" className="add-button" onClick={startAdd}>
              <MuiSvgIcon size={17}>lucide:plus</MuiSvgIcon>
              Agregar registro
            </button>
          )}
        </div>
      ) : (
        <>
        <div className="lab-table-container">
          <div className="lab-table">
            <table>
              <thead>
                <tr>
                  {columns.map(column => <th key={column.label}>{column.label}</th>)}
                  <th className="lab-table__actions-heading">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map(row => (
                  <tr key={row.id}>
                    {columns.map(column => <td key={column.label}>{column.render(row)}</td>)}
                    <td>
                      <div className="lab-actions">
                        <button
                          type="button"
                          className="lab-icon-btn"
                          onClick={() => startEdit(row)}
                          aria-label="Editar"
                          title="Editar"
                        >
                          <MuiSvgIcon size={16}>lucide:pencil</MuiSvgIcon>
                        </button>
                        <button
                          type="button"
                          className="lab-icon-btn danger"
                          onClick={() => onDelete(row)}
                          aria-label="Eliminar"
                          title="Eliminar"
                        >
                          <MuiSvgIcon size={16}>lucide:trash-2</MuiSvgIcon>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <ModulePagination
          page={page}
          pageCount={pageCount}
          pageSize={pageSize}
          total={filtered.length}
          setPage={setPage}
          setPageSize={setPageSize}
        />
        </>
      )}

      {open && (
        <CatalogModal
          title={modalTitle}
          description={modalDescription}
          size={modalSize}
          onClose={close}
          footer={renderFooter(close)}
        >
          {renderForm()}
        </CatalogModal>
      )}
    </div>
  )
}
