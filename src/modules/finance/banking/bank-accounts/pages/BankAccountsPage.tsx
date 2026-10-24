import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { AppModal } from '@/components/ui/modal'
import { useState, useCallback } from "react"
import { useBankAccounts } from "../hooks/useBankAccounts"
import { useCreateBankAccount } from "../hooks/useCreateBankAccount"
import { useUpdateBankAccount } from "../hooks/useUpdateBankAccount"
import { BankAccountTable } from "../components/BankAccountTable"
import { BankAccountForm } from "../components/BankAccountForm"
import { BankAccountFilters } from "../components/BankAccountFilters"
import { BankAccountSkeleton } from "../components/BankAccountSkeleton"
import type { BankAccount } from "../types/bank-accounts.types"
import { useAuthStore } from "@/app/store/auth.store"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/bank-accounts.scss"
import { Button } from '@/components/ui/Button'

export const BankAccountsPage = () => {
  const { currentCompanyId, isSuperAdmin } = useAuthStore()
  
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [bankId, setBankId] = useState<number | undefined>(undefined)
  const [currencyId, setCurrencyId] = useState<number | undefined>(undefined)
  const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useBankAccounts({
    search: debouncedSearch || undefined,
    bank_id: bankId,
    currency_id: currencyId,
    company_id: currentCompanyId || undefined
  })
  
  const { mutate: createBankAccount, isPending: isCreating } = useCreateBankAccount()
  const { mutate: updateBankAccount, isPending: isUpdating } = useUpdateBankAccount()

  const handleSubmit = useCallback((bankAccountData: Partial<BankAccount>) => {
    if (selectedBankAccount) {
      updateBankAccount(
        { id: selectedBankAccount.id, data: bankAccountData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setSelectedBankAccount(null)
          }
        }
      )
    } else {
      createBankAccount(bankAccountData as any, {
        onSuccess: () => {
          setIsModalOpen(false)
        }
      })
    }
  }, [selectedBankAccount, updateBankAccount, createBankAccount])

  const handleEdit = useCallback((bankAccount: BankAccount) => {
    setSelectedBankAccount(bankAccount)
    setIsModalOpen(true)
  }, [])

  const handleAdd = useCallback(() => {
    setSelectedBankAccount(null)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedBankAccount(null)
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearch("")
    setBankId(undefined)
    setCurrencyId(undefined)
  }, [])

  const allBankAccounts = data?.pages.flatMap(page => page.results) || []
  const totalBankAccounts = data?.pages[0]?.count || 0
  const { visibleData: paginatedBankAccounts, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allBankAccounts, total: totalBankAccounts, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  if (isLoading && !data) {
    return <BankAccountSkeleton />
  }

  return (
    <div className="bank-accounts-page">
      {/* Header */}
      <div className="bank-accounts-page__header">
        <div className="bank-accounts-page__header-left">
          <h1 className="bank-accounts-page__title">
            Cuentas Bancarias
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
      <BankAccountFilters
        searchTerm={search}
        onSearchChange={setSearch}
        bankId={bankId}
        onBankIdChange={setBankId}
        currencyId={currencyId}
        onCurrencyIdChange={setCurrencyId}
        onClearFilters={handleClearFilters}
        totalResults={totalBankAccounts}
      />

      {/* Bank Accounts Table */}
      <div className="bank-accounts-page__content">
        {paginatedBankAccounts.length > 0 ? (
          <>
            <BankAccountTable 
              data={paginatedBankAccounts} 
              onEdit={handleEdit}
              onRefresh={refetch}
              isSuperAdmin={isSuperAdmin}
            />
            
            <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalBankAccounts}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
          </>
        ) : (
          <div className="bank-accounts-empty">
            <svg className="bank-accounts-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>No hay cuentas bancarias registradas</h3>
            <p>Comienza creando una nueva cuenta bancaria en el sistema</p>
            <button className="bank-accounts-empty__button" onClick={handleAdd}>
              Crear Cuenta Bancaria
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AppModal
          title={selectedBankAccount ? 'Editar Cuenta Bancaria' : 'Nueva Cuenta Bancaria'}
          onClose={handleCloseModal}
          footer={
            <>
              <Button variant="secondary" type="button" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit" form="customer-form" isLoading={isCreating || isUpdating}>
                Guardar
              </Button>
            </>
          }
        >
          <BankAccountForm 
            onSubmit={handleSubmit}
            initialData={selectedBankAccount}
            onCancel={handleCloseModal}
            isEditing={!!selectedBankAccount}
            isSubmitting={isCreating || isUpdating}
          />
        </AppModal>
      )}
    </div>
  )
}
