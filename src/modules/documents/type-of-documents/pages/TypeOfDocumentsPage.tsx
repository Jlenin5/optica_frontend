import { useDebounce } from "@/hooks/useDebounce"
import { useState } from "react"
import { useTypeOfDocuments } from "../hooks/useTypeOfDocuments"
import { useCreateTypeOfDocument } from "../hooks/useCreateTypeOfDocument"
import { useUpdateTypeOfDocument } from "../hooks/useUpdateTypeOfDocument"
import { TypeOfDocumentsTable } from "../components/TypeOfDocumentsTable"
import { TypeOfDocumentModal } from "../components/TypeOfDocumentModal"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/type-of-documents.scss"

export const TypeOfDocumentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDocumentType, setSelectedDocumentType] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 350)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined)
  const itemsPerPage = 10

  const { data, isLoading, error, refetch } = useTypeOfDocuments({
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
    search: debouncedSearchTerm,
    status: statusFilter
  })

  const { mutate: createTypeOfDocument, isPending: isCreating } = useCreateTypeOfDocument()
  const { mutate: updateTypeOfDocument, isPending: isUpdating } = useUpdateTypeOfDocument()

  const handleAdd = () => {
    setSelectedDocumentType(null)
    setIsModalOpen(true)
  }

  const handleEdit = (documentType: any) => {
    setSelectedDocumentType(documentType)
    setIsModalOpen(true)
  }

  const handleSubmit = (formData: any) => {
    if (selectedDocumentType) {
      updateTypeOfDocument(
        { id: selectedDocumentType.id, data: formData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setSelectedDocumentType(null)
            refetch()
          }
        }
      )
    } else {
      createTypeOfDocument(formData, {
        onSuccess: () => {
          setIsModalOpen(false)
          refetch()
        }
      })
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedDocumentType(null)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleStatusFilter = (status: boolean | undefined) => {
    setStatusFilter(status)
    setCurrentPage(1)
  }

  if (isLoading && !data) {
    return (
      <div className="type-of-documents-page__loading">
        <div className="type-of-documents-page__spinner"></div>
        <p>Cargando tipos de documento...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="type-of-documents-page__error">
        <MuiSvgIcon size={48}>
          lucide:alert-circle
        </MuiSvgIcon>
        <p>Error al cargar los tipos de documento</p>
        <button onClick={() => refetch()} className="type-of-documents-page__retry-btn">
          Reintentar
        </button>
      </div>
    )
  }

  const isPending = isCreating || isUpdating
  const documentTypes = data?.results || []
  const totalPages = data ? Math.ceil(data.count / 10) : 0

  return (
    <div className="type-of-documents-page">
      <div className="type-of-documents-page__header">
        <div className="type-of-documents-page__header-left">
          <h1 className="type-of-documents-page__title">Tipos de Documento</h1>
          <p className="type-of-documents-page__subtitle">
            Gestiona los tipos de documentos utilizados en el sistema
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="type-of-documents-page__add-btn"
          disabled={isPending}
        >
          <MuiSvgIcon size={20}>
            lucide:plus
          </MuiSvgIcon>
          Agregar
        </button>
      </div>

      <div className="type-of-documents-filters">
        <div className="type-of-documents-filters__search">
          <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
          <input
            type="text"
            placeholder="Buscar por descripción, código o abreviatura..."
            value={searchTerm}
            onChange={handleSearch}
            // className="type-of-documents-page__search-input"
          />
        </div>

        <div className="type-of-documents-page__status-filter">
          <button
            onClick={() => handleStatusFilter(undefined)}
            className={`type-of-documents-page__filter-btn ${statusFilter === undefined ? 'type-of-documents-page__filter-btn--active' : ''}`}
          >
            Todos
          </button>
          <button
            onClick={() => handleStatusFilter(true)}
            className={`type-of-documents-page__filter-btn ${statusFilter === true ? 'type-of-documents-page__filter-btn--active' : ''}`}
          >
            Activos
          </button>
          <button
            onClick={() => handleStatusFilter(false)}
            className={`type-of-documents-page__filter-btn ${statusFilter === false ? 'type-of-documents-page__filter-btn--active' : ''}`}
          >
            Inactivos
          </button>
        </div>
      </div>

      <div className="type-of-documents-page__content">
        <TypeOfDocumentsTable
          data={documentTypes}
          onEdit={handleEdit}
          onRefresh={refetch}
        />
      </div>

      {totalPages > 1 && (
        <div className="type-of-documents-page__pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="type-of-documents-page__pagination-btn"
          >
            <MuiSvgIcon size={20}>
              lucide:chevron-left
            </MuiSvgIcon>
          </button>
          
          <span className="type-of-documents-page__pagination-info">
            Página {currentPage} de {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="type-of-documents-page__pagination-btn"
          >
            <MuiSvgIcon size={20}>
              lucide:chevron-right
            </MuiSvgIcon>
          </button>
        </div>
      )}

      <TypeOfDocumentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={selectedDocumentType}
        isEditing={!!selectedDocumentType}
        isLoading={isPending}
      />
    </div>
  )
}