import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { AppModal } from '@/components/ui/modal'
import { useState, useCallback } from "react"
import { useBanks } from "../hooks/useBanks"
import { useCreateBank } from "../hooks/useCreateBank"
import { useUpdateBank } from "../hooks/useUpdateBank"
import { BankTable } from "../components/BankTable"
import { BankForm } from "../components/BankForm"
import { BankFilters } from "../components/BankFilters"
import { BankSkeleton } from "../components/BankSkeleton"
import type { Bank } from "../types/banks.types"
import { useAuthStore } from "@/app/store/auth.store"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/banks.scss"

export const BanksPage = () => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useBanks({
    search: debouncedSearch || undefined,
    company_id: currentCompanyId || undefined
  })
  
  const { mutate: createBank, isPending: isCreating } = useCreateBank()
  const { mutate: updateBank, isPending: isUpdating } = useUpdateBank()

  const handleSubmit = useCallback((bankData: Partial<Bank>) => {
    if (selectedBank) {
      updateBank(
        { id: selectedBank.id, data: bankData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setSelectedBank(null)
          }
        }
      )
    } else {
      createBank(bankData as any, {
        onSuccess: () => {
          setIsModalOpen(false)
        }
      })
    }
  }, [selectedBank, updateBank, createBank])

  const handleEdit = useCallback((bank: Bank) => {
    setSelectedBank(bank)
    setIsModalOpen(true)
  }, [])

  const handleAdd = useCallback(() => {
    setSelectedBank(null)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedBank(null)
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearch("")
  }, [])

  const allBanks = data?.pages.flatMap(page => page.results) || []
  const totalBanks = data?.pages[0]?.count || 0
  const { visibleData: paginatedBanks, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allBanks, total: totalBanks, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  if (isLoading && !data) {
    return <BankSkeleton />
  }

  return (
    <div className="banks-page">
      <div className="banks-page__header">
        <div className="banks-page__header-left">
          <h1 className="banks-page__title">
            Bancos
          </h1>
        </div>
        <button className="add-button" onClick={handleAdd}>
          <MuiSvgIcon size={18}>
            lucide:plus
          </MuiSvgIcon>
          Agregar
        </button>
      </div>

      <BankFilters
        searchTerm={search}
        onSearchChange={setSearch}
        onClearFilters={handleClearFilters}
        totalResults={totalBanks}
      />

      <div className="banks-page__content">
        {paginatedBanks.length > 0 ? (
          <>
            <BankTable 
              data={paginatedBanks} 
              onEdit={handleEdit}
              onRefresh={refetch}
              isSuperAdmin={isSuperAdmin}
            />
            
            <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalBanks}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
          </>
        ) : (
          <div className="banks-empty">
            <svg className="banks-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>No hay bancos registrados</h3>
            <p>Comienza creando un nuevo banco en el sistema</p>
            <button className="banks-empty__button" onClick={handleAdd}>
              Crear Banco
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AppModal
          title={selectedBank ? 'Editar Banco' : 'Nuevo Banco'}
          onClose={handleCloseModal}
        >
              <BankForm 
                onSubmit={handleSubmit}
                initialData={selectedBank}
                onCancel={handleCloseModal}
                isEditing={!!selectedBank}
                isSubmitting={isCreating || isUpdating}
              />
        </AppModal>
      )}
    </div>
  )
}
