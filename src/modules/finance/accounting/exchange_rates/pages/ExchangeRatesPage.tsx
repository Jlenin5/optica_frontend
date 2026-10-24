import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { AppModal } from '@/components/ui/modal'
import { useState, useCallback } from "react"
import { useExchangeRates } from "../hooks/useExchangeRates"
import { useCreateExchangeRate } from "../hooks/useCreateExchangeRate"
import { ExchangeRateTable } from "../components/ExchangeRateTable"
import { ExchangeRateForm } from "../components/ExchangeRateForm"
import { ExchangeRateFilters } from "../components/ExchangeRateFilters"
import { ExchangeRateSkeleton } from "../components/ExchangeRateSkeleton"
import { useAuthStore } from "@/app/store/auth.store"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/exchange-rates.scss"
import { Button } from '@/components/ui/Button'

export const ExchangeRatesPage = () => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useExchangeRates({
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    company_id: currentCompanyId || undefined
  })
  
  const { mutate: createExchangeRate, isPending: isCreating } = useCreateExchangeRate()

  const handleSubmit = useCallback((exchangeRateData: any) => {
    createExchangeRate(exchangeRateData, {
      onSuccess: () => {
        setIsModalOpen(false)
      }
    })
  }, [createExchangeRate])

  const handleAdd = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleClearFilters = useCallback(() => {
    setDateFrom("")
    setDateTo("")
  }, [])

  const allExchangeRates = data?.pages.flatMap(page => page.results) || []
  const totalExchangeRates = data?.pages[0]?.count || 0
  const { visibleData: paginatedExchangeRates, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allExchangeRates, total: totalExchangeRates, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  if (isLoading) {
    return <ExchangeRateSkeleton />
  }

  return (
    <div className="exchange-rates-page">
      {/* Header */}
      <div className="exchange-rates-page__header">
        <div className="exchange-rates-page__header-left">
          <h1 className="exchange-rates-page__title">
            Tasas de Cambio
          </h1>
        </div>
        <button className="add-button" onClick={handleAdd}>
          <MuiSvgIcon size={18}>
            lucide:plus
          </MuiSvgIcon>
          Agregar
        </button>
      </div>

      {/* Filters */}
      <ExchangeRateFilters
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        onClearFilters={handleClearFilters}
        totalResults={totalExchangeRates}
      />

      {/* Exchange Rates Table */}
      <div className="exchange-rates-page__content">
        {paginatedExchangeRates.length > 0 ? (
          <>
            <ExchangeRateTable 
              data={paginatedExchangeRates} 
              onRefresh={refetch}
              isSuperAdmin={isSuperAdmin}
            />
            
            <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalExchangeRates}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
          </>
        ) : (
          <div className="exchange-rates-empty">
            <svg className="exchange-rates-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>No hay tasas de cambio registradas</h3>
            <p>Comienza creando una nueva tasa de cambio en el sistema</p>
            <button className="exchange-rates-empty__button" onClick={handleAdd}>
              Crear Tasa de Cambio
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AppModal
          title="Nueva Tasa de Cambio"
          onClose={handleCloseModal}
          footer={
            <>
              <Button variant="secondary" type="button" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit" form="customer-form" isLoading={isCreating}>
                Guardar
              </Button>
            </>
          }
        >
          <ExchangeRateForm 
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            isSubmitting={isCreating}
          />
        </AppModal>
      )}
    </div>
  )
}
