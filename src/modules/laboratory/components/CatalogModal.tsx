import { AppModal } from '@/components/ui/modal'
import type React from 'react'
import '@/styles/laboratory.scss'

interface CatalogModalProps {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  onClose: () => void
  size?: 'sm' | 'md' | 'lg'
}

/** Adaptador del catálogo al modal global. Todos los módulos pueden reutilizar AppModal directamente. */
export function CatalogModal({ title, description, children, footer, onClose, size = 'md' }: CatalogModalProps) {
  return <AppModal title={title} description={description} footer={footer} onClose={onClose} size={size} closeOnOverlay={false}>{children}</AppModal>
}
