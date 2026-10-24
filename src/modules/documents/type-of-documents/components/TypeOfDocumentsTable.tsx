import { useState } from "react"
import { useDeleteTypeOfDocument } from "../hooks/useDeleteTypeOfDocument"
import MuiSvgIcon from '@components/MuiSvgIcon'
import type { TypeOfDocument } from "../types/type-of-documents.types"

interface TypeOfDocumentsTableProps {
  data?: TypeOfDocument[]
  onEdit: (documentType: TypeOfDocument) => void
  onRefresh: () => void
}

export const TypeOfDocumentsTable = ({ data = [], onEdit, onRefresh }: TypeOfDocumentsTableProps) => {
  const { mutate: deleteTypeOfDocument, isPending: isDeleting } = useDeleteTypeOfDocument()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este tipo de documento?')) {
      setDeletingId(id)
      deleteTypeOfDocument(id, {
        onSettled: () => {
          setDeletingId(null)
          onRefresh()
        }
      })
    }
  }

  const formatDate = (date: string) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="type-of-documents-table-container">
      <table className="type-of-documents-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Abreviatura</th>
            <th>Código</th>
            <th>Estado</th>
            <th>Creado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((docType) => (
            <tr key={docType.id}>
              <td>{docType.id}</td>
              <td>
                <div className="type-of-documents-table__description">
                  {docType.description.toUpperCase()}
                </div>
              </td>
              <td>
                {docType.abbreviation && (
                  <span className="type-of-documents-table__abbreviation">
                    {docType.abbreviation}
                  </span>
                )}
              </td>
              <td>
                {docType.code && (
                  <code className="type-of-documents-table__code">
                    {docType.code}
                  </code>
                )}
              </td>
              <td>
                <span className={`type-of-documents-table__status type-of-documents-table__status--${docType.status ? 'active' : 'inactive'}`}>
                  {docType.status ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="type-of-documents-table__date">
                {formatDate(docType.created_at)}
              </td>
              <td className="type-of-documents-table__actions">
                <button
                  onClick={() => onEdit(docType)}
                  className="type-of-documents-table__action-btn type-of-documents-table__action-btn--edit"
                  title="Editar"
                >
                  <MuiSvgIcon size={18}>
                    heroicons-outline:pencil-square
                  </MuiSvgIcon>
                </button>
                <button
                  onClick={() => handleDelete(docType.id)}
                  disabled={isDeleting && deletingId === docType.id}
                  className="type-of-documents-table__action-btn type-of-documents-table__action-btn--delete"
                  title="Eliminar"
                >
                  {isDeleting && deletingId === docType.id ? (
                    <span className="type-of-documents-table__spinner"></span>
                  ) : (
                    <MuiSvgIcon size={18}>
                      lucide:trash-2
                    </MuiSvgIcon>
                  )}
                </button>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={7} className="type-of-documents-table__empty">
                <MuiSvgIcon size={48}>
                  lucide:file-x
                </MuiSvgIcon>
                <p>No hay tipos de documento registrados</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}