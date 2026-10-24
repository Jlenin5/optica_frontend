import { ModulePagination } from '@/components/ui/module/ModulePagination'
import { AppModal } from '@/components/ui/modal'
import { useState } from "react"
import { useCompanies } from "../hooks/useCompanies"
import { useCreateCompany } from "../hooks/useCreateCompany"
import { useUpdateCompany } from "../hooks/useUpdateCompany"
import { CompanyTable } from "../components/CompanyTable"
import { CompanyForm } from "../components/CompanyForm"
import { CompanyFilters } from "../components/CompanyFilters"
import { CompanyCard } from "../components/CompanyCard"
import "@styles/companies.scss"
import type { Company } from "../types/companies.types"

export const CompaniesPage = () => {
  const { data, isLoading, refetch } = useCompanies({ limit: 100 })
  const { mutate: createCompany, isPending: isCreating } = useCreateCompany()
  const { mutate: updateCompany, isPending: isUpdating } = useUpdateCompany()
  
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  const handleSubmit = (companyData: Company) => {
    if (selectedCompany) {
      updateCompany(
        { id: selectedCompany.id, data: companyData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setSelectedCompany(null)
            refetch()
          }
        }
      )
    } else {
      createCompany(companyData, {
        onSuccess: () => {
          setIsModalOpen(false)
          refetch()
        }
      })
    }
  }

  const handleSearchChange = (value: string) => { setSearchTerm(value); setPage(0) }
  const handleStatusChange = (value: 'all' | 'active' | 'inactive') => { setStatusFilter(value); setPage(0) }

  const handleEdit = (company: Company) => {
    setSelectedCompany(company)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedCompany(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCompany(null)
  }

  // Filtrar empresas
  const filteredCompanies = (data?.results || [])?.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          company.ruc.includes(searchTerm) ||
                          (company.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && company.status) ||
                         (statusFilter === 'inactive' && !company.status)
    
    return matchesSearch && matchesStatus
  })

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const pageCount = Math.max(1, Math.ceil(filteredCompanies.length / pageSize))
  const visibleCompanies = filteredCompanies.slice(page * pageSize, (page + 1) * pageSize)

  if (isLoading) {
    return (
      <div className="companies-page">
        <div className="companies-loading">
          <div className="companies-loading__spinner"></div>
          <p>Cargando empresas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="companies-page">
      {/* Header */}
      <div className="companies-page__header">
        <div className="companies-page__header-left">
          <h1 className="companies-page__title">Empresas</h1>
        </div>
        <button className="companies-page__add-button" onClick={handleAdd}>
          <svg className="companies-page__add-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Agregar
        </button>
      </div>

      {/* Filtros */}
      <CompanyFilters
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusChange}
      />

      {/* Contenido */}
      <div className="companies-page__content">
        {filteredCompanies && filteredCompanies.length > 0 ? (
          viewMode === 'table' ? (
            <CompanyTable 
              data={visibleCompanies} 
              onEdit={handleEdit}
              onRefresh={refetch}
            />
          ) : (
            <div className="companies-grid">
              {visibleCompanies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  onEdit={handleEdit}
                  onRefresh={refetch}
                />
              ))}
            </div>
          )
        ) : (
          <div className="companies-empty">
            <svg className="companies-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M9 12H15M12 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>No hay empresas registradas</h3>
            <p>Comienza agregando una nueva empresa al sistema</p>
            <button className="companies-empty__button" onClick={handleAdd}>
              Agregar Empresa
            </button>
          </div>
        )}
        {filteredCompanies.length > 0 && (
          <ModulePagination
            page={page}
            pageCount={pageCount}
            pageSize={pageSize}
            total={filteredCompanies.length}
            setPage={setPage}
            setPageSize={setPageSize}
          />
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AppModal
          title={selectedCompany ? 'Editar Empresa' : 'Nueva Empresa'}
          onClose={handleCloseModal}
        >
              <CompanyForm 
                onSubmit={handleSubmit}
                initialData={selectedCompany}
                onCancel={handleCloseModal}
                isEditing={!!selectedCompany}
                isSubmitting={isCreating || isUpdating}
              />
        </AppModal>
      )}
    </div>
  )
}
