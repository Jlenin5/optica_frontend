import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { AppModal } from '@/components/ui/modal'
import { useState, useCallback } from "react"
import { useCurrencies } from "../hooks/useCurrencies"
import { useCreateCurrency } from "../hooks/useCreateCurrency"
import { useUpdateCurrency } from "../hooks/useUpdateCurrency"
import { CurrencyTable } from "../components/CurrencyTable"
import { CurrencyForm } from "../components/CurrencyForm"
import { CurrencyFilters } from "../components/CurrencyFilters"
import { CurrencySkeleton } from "../components/CurrencySkeleton"
import type { Currency } from "../types/currencies.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/currencies.scss"
import { Button } from '@/components/ui/Button'

export const CurrenciesPage = () => {  
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useCurrencies({
    search: debouncedSearch || undefined
  })
  
  const { mutate: createCurrency, isPending: isCreating } = useCreateCurrency()
  const { mutate: updateCurrency, isPending: isUpdating } = useUpdateCurrency()

  const handleSubmit = useCallback((currencyData: Partial<Currency>) => {
    if (selectedCurrency) {
      updateCurrency(
        { id: selectedCurrency.id, data: currencyData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setSelectedCurrency(null)
          }
        }
      )
    } else {
      createCurrency(currencyData as any, {
        onSuccess: () => {
          setIsModalOpen(false)
        }
      })
    }
  }, [selectedCurrency, updateCurrency, createCurrency])

  const handleEdit = useCallback((currency: Currency) => {
    setSelectedCurrency(currency)
    setIsModalOpen(true)
  }, [])

  const handleAdd = useCallback(() => {
    setSelectedCurrency(null)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedCurrency(null)
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearch("")
  }, [])

  const allCurrencies = data?.pages.flatMap(page => page.results) || []
  const totalCurrencies = data?.pages[0]?.count || 0
  const { visibleData: paginatedCurrencies, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allCurrencies, total: totalCurrencies, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  if (isLoading && !data) {
    return <CurrencySkeleton />
  }

  return (
    <div className="currencies-page">
      <div className="currencies-page__header">
        <div className="currencies-page__header-left">
          <h1 className="currencies-page__title">
            Monedas
          </h1>
        </div>
        <button className="currencies-page__add-button" onClick={handleAdd}>
          <MuiSvgIcon size={18}>
            lucide:plus
          </MuiSvgIcon>
          Agregar
        </button>
      </div>

      {/* Filters */}
      <CurrencyFilters
        searchTerm={search}
        onSearchChange={setSearch}
        onClearFilters={handleClearFilters}
        totalResults={totalCurrencies}
      />

      {/* Currencies Table */}
      <div className="currencies-page__content">
        {paginatedCurrencies.length > 0 ? (
          <>
            <div className="currencies-page__table-header">
              <h3>Lista de Monedas</h3>
              <span className="currencies-page__count">{totalCurrencies} monedas</span>
            </div>
            
            <CurrencyTable 
              data={paginatedCurrencies} 
              onEdit={handleEdit}
              onRefresh={refetch}
            />
            
            <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalCurrencies}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
          </>
        ) : (
          <div className="currencies-empty">
            <svg className="currencies-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>No hay monedas registradas</h3>
            <p>Comienza creando una nueva moneda en el sistema</p>
            <button className="currencies-empty__button" onClick={handleAdd}>
              Crear Moneda
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AppModal
          title={selectedCurrency ? 'Editar Moneda' : 'Nueva Moneda'}
          onClose={handleCloseModal}
          footer={
            <>
              <Button variant="secondary" type="button" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit" form="patient-form" isLoading={isCreating || isUpdating}>
                Guardar
              </Button>
            </>
          }
        >
          <CurrencyForm
            onSubmit={handleSubmit}
            initialData={selectedCurrency}
            onCancel={handleCloseModal}
            isEditing={!!selectedCurrency}
            isSubmitting={isCreating || isUpdating}
          />
        </AppModal>
      )}
    </div>
  )
}
