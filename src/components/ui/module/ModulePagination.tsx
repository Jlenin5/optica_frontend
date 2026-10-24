import { useEffect, useMemo, useState } from 'react'
import MuiSvgIcon from '@components/MuiSvgIcon'

type Props<T> = {
  data: T[]
  total: number
  fetchNextPage?: () => unknown
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  initialPageSize?: number
  pageSizes?: number[]
}

export function useModulePagination<T>({
  data,
  total,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  initialPageSize = 10,
}: Omit<Props<T>, 'pageSizes'>) {
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const visibleData = useMemo(
    () => data.slice(page * pageSize, (page + 1) * pageSize),
    [data, page, pageSize],
  )

  useEffect(() => {
    setPage(0)
  }, [pageSize, total])

  useEffect(() => {
    if (page >= pageCount) setPage(Math.max(0, pageCount - 1))
  }, [page, pageCount])

  useEffect(() => {
    const requiredItems = (page + 1) * pageSize
    if (
      requiredItems > data.length &&
      hasNextPage &&
      !isFetchingNextPage &&
      fetchNextPage
    ) {
      fetchNextPage()
    }
  }, [page, pageSize, data.length, hasNextPage, isFetchingNextPage, fetchNextPage])

  return { visibleData, page, pageCount, pageSize, setPage, setPageSize }
}

export function ModulePagination({
  page,
  pageCount,
  pageSize,
  total,
  setPage,
  setPageSize,
  isLoading = false,
}: {
  page: number
  pageCount: number
  pageSize: number
  total: number
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  isLoading?: boolean
}) {
  if (!total && !isLoading) return null

  const start = total === 0 ? 0 : page * pageSize + 1
  const end = Math.min((page + 1) * pageSize, total)
  const pages = Array.from(new Set([0, page - 1, page, page + 1, pageCount - 1]))
    .filter((p) => p >= 0 && p < pageCount)
    .sort((a, b) => a - b)

  return (
    <div className="module-pagination" aria-label="Paginación de registros">
      <div className="module-pagination__summary">
        <span>Filas por página</span>
        <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
          {[10, 20, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}
        </select>
        <span className="module-pagination__range">{start}–{end} de {total}</span>
      </div>

      <div className="module-pagination__controls">
        <button type="button" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} aria-label="Página anterior">
          <MuiSvgIcon size={17}>lucide:chevron-left</MuiSvgIcon>
        </button>
        {pages.map((p, index) => {
          const previous = pages[index - 1]
          const gap = previous !== undefined && p - previous > 1
          return (
            <span key={p} className="module-pagination__page-wrap">
              {gap && <span className="module-pagination__ellipsis">…</span>}
              <button type="button" className={p === page ? 'is-active' : ''} onClick={() => setPage(p)} aria-current={p === page ? 'page' : undefined}>
                {p + 1}
              </button>
            </span>
          )
        })}
        <button type="button" onClick={() => setPage(Math.min(pageCount - 1, page + 1))} disabled={page >= pageCount - 1} aria-label="Página siguiente">
          <MuiSvgIcon size={17}>lucide:chevron-right</MuiSvgIcon>
        </button>
      </div>
    </div>
  )
}