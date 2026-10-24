import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { AppModal } from '@/components/ui/modal'
import { useState, useCallback } from "react"
import { useTaxes } from "../hooks/useTaxes"
import { useCreateTax } from "../hooks/useCreateTax"
import { useUpdateTax } from "../hooks/useUpdateTax"
import { TaxTable } from "../components/TaxTable"
import { TaxForm } from "../components/TaxForm"
import { TaxFilters } from "../components/TaxFilters"
import { TaxSkeleton } from "../components/TaxSkeleton"
import type { Tax } from "../types/taxes.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/taxes.scss"

export const TaxesPage = () => {  
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [selectedTax, setSelectedTax] = useState<Tax | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useTaxes({
    search: debouncedSearch || undefined
  })
  
  const { mutate: createTax, isPending: isCreating } = useCreateTax()
  const { mutate: updateTax, isPending: isUpdating } = useUpdateTax()

  const handleSubmit = useCallback((taxData: Partial<Tax>) => {
    if (selectedTax) {
      updateTax(
        { id: selectedTax.id, data: taxData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setSelectedTax(null)
          }
        }
      )
    } else {
      createTax(taxData as any, {
        onSuccess: () => {
          setIsModalOpen(false)
        }
      })
    }
  }, [selectedTax, updateTax, createTax])

  const handleEdit = useCallback((tax: Tax) => {
    setSelectedTax(tax)
    setIsModalOpen(true)
  }, [])

  const handleAdd = useCallback(() => {
    setSelectedTax(null)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedTax(null)
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearch("")
  }, [])

  const allTaxes = data?.pages.flatMap(page => page.results) || []
  const totalTaxes = data?.pages[0]?.count || 0
  const { visibleData: paginatedTaxes, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allTaxes, total: totalTaxes, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  if (isLoading && !data) {
    return <TaxSkeleton />
  }

  return (
    <div className="taxes-page">
      <div className="taxes-page__header">
        <div className="taxes-page__header-left">
          <h1 className="taxes-page__title">
            Impuestos
          </h1>
        </div>
        <button className="add-button" onClick={handleAdd}>
          <MuiSvgIcon size={18}>
            lucide:plus
          </MuiSvgIcon>
          Agregar
        </button>
      </div>

      <TaxFilters
        searchTerm={search}
        onSearchChange={setSearch}
        onClearFilters={handleClearFilters}
        totalResults={totalTaxes}
      />

      <div className="taxes-page__content">
        {paginatedTaxes.length > 0 ? (
          <>
            <TaxTable 
              data={paginatedTaxes} 
              onEdit={handleEdit}
              onRefresh={refetch}
            />
            
            <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalTaxes}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
          </>
        ) : (
          <div className="taxes-empty">
            <svg className="taxes-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>No hay impuestos registrados</h3>
            <p>Comienza creando un nuevo impuesto en el sistema</p>
            <button className="taxes-empty__button" onClick={handleAdd}>
              Crear Impuesto
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AppModal
          title={selectedTax ? 'Editar Impuesto' : 'Nuevo Impuesto'}
          onClose={handleCloseModal}
        >
              <TaxForm 
                onSubmit={handleSubmit}
                initialData={selectedTax}
                onCancel={handleCloseModal}
                isEditing={!!selectedTax}
                isSubmitting={isCreating || isUpdating}
              />
        </AppModal>
      )}
    </div>
  )
}
