import { AppModal } from '@/components/ui/modal'
import { useEffect } from "react"
import { TypeOfDocumentForm } from "./TypeOfDocumentForm"
import type { TypeOfDocument } from "../types/type-of-documents.types"
import type { TypeOfDocumentFormData } from "../schemas/type-of-document.schema"

interface TypeOfDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TypeOfDocumentFormData) => void
  initialData?: TypeOfDocument
  isEditing?: boolean
  isLoading?: boolean
}

export const TypeOfDocumentModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  isEditing = false,
  isLoading = false 
}: TypeOfDocumentModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <AppModal
      title={isEditing ? 'Editar Tipo de Documento' : 'Nuevo Tipo de Documento'}
      onClose={onClose}
      size="sm"
    >
      <TypeOfDocumentForm
        onSubmit={onSubmit}
        onCancel={onClose}
        initialData={initialData}
        isEditing={isEditing}
        isLoading={isLoading}
      />
    </AppModal>
  )
}
