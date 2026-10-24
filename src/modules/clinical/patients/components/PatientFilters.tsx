import MuiSvgIcon from '@components/MuiSvgIcon'
import { useTypeOfDocuments } from "@/modules/documents/type-of-documents/hooks/useTypeOfDocuments"

interface PatientFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: boolean | undefined
  onStatusFilterChange: (status: boolean | undefined) => void
  documentTypeId: number | undefined
  onDocumentTypeIdChange: (id: number | undefined) => void
  onClearFilters: () => void
}

export const PatientFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  documentTypeId,
  onDocumentTypeIdChange,
  onClearFilters
}: PatientFiltersProps) => {
  const { data: documentsData } = useTypeOfDocuments({ status: true, limit: 100 })
  const documents = documentsData?.results || []

  const hasActiveFilters = searchTerm || statusFilter !== undefined || documentTypeId

  return (
    <div className="patient-filters">
      <div className="patient-filters__left">
        <div className="patient-filters__search">
          <MuiSvgIcon size={20}>lucide:search</MuiSvgIcon>
          <input
            type="text"
            placeholder="Buscar por nombre, documento o teléfono..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="patient-filters__right">
        <select 
          className="patient-filters__select"
          value={documentTypeId || ""}
          onChange={(e) => onDocumentTypeIdChange(e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">Todos los documentos</option>
          {documents.map(doc => (
            <option key={doc.id} value={doc.id}>
              {doc.abbreviation}
            </option>
          ))}
        </select>

        <select 
          className="patient-filters__select"
          value={statusFilter === undefined ? 'all' : statusFilter ? 'active' : 'inactive'}
          onChange={(e) => {
            const value = e.target.value
            if (value === 'all') onStatusFilterChange(undefined)
            else if (value === 'active') onStatusFilterChange(true)
            else onStatusFilterChange(false)
          }}
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>

        {hasActiveFilters && (
          <button
            className="patient-filters__clear"
            onClick={onClearFilters}
            title="Limpiar filtros"
          >
            <MuiSvgIcon size={18}>lucide:x</MuiSvgIcon>
            Limpiar
          </button>
        )}
      </div>
    </div>
  )
}