import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { AppModal } from '@/components/ui/modal'
import { useState } from "react"
import { useFeatures } from "../hooks/useFeatures"
import { useCreateFeature } from "../hooks/useCreateFeature"
import { useUpdateFeature } from "../hooks/useUpdateFeature"
import { FeatureTable } from "../components/FeatureTable"
import { FeatureForm } from "../components/FeatureForm"
import { FeatureFilters } from "../components/FeatureFilters"
import { FeatureSkeleton } from "../components/FeatureSkeleton"
import type { Feature } from "../types/features.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import "@styles/features.scss"
import { Button } from '@/components/ui/Button'

export const FeaturesPage = () => {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useFeatures({
    search: debouncedSearch || undefined
  })
  
  const { mutate: createFeature, isPending: isCreating } = useCreateFeature()
  const { mutate: updateFeature, isPending: isUpdating } = useUpdateFeature()

  const handleSubmit = (featureData: Partial<Feature>) => {
    if (selectedFeature) {
      updateFeature(
        { id: selectedFeature.id, data: featureData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setSelectedFeature(null)
          }
        }
      )
    } else {
      createFeature(featureData as Omit<Feature, 'id'>, {
        onSuccess: () => {
          setIsModalOpen(false)
        }
      })
    }
  }

  const handleEdit = (feature: Feature) => {
    setSelectedFeature(feature)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedFeature(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedFeature(null)
  }

  const allFeatures = data?.pages.flatMap(page => page.results) || []
  const totalFeatures = data?.pages[0]?.count || 0
  const { visibleData: paginatedFeatures, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allFeatures, total: totalFeatures, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  return (
    <div className="features-page">
      <div className="features-page__header">
        <div className="features-page__header-left">
          <h1 className="features-page__title">Características del Sistema</h1>
        </div>
        <button className="add-button" onClick={handleAdd}>
          <MuiSvgIcon size={18}>
            lucide:plus
          </MuiSvgIcon>
          Agregar
        </button>
      </div>

      {/* Filters */}
      <FeatureFilters
        searchTerm={search}
        onSearchChange={setSearch}
      />

      {/* Features Table */}
      <div className="features-page__content">
        {isLoading ? (
          <FeatureSkeleton />
        ) : paginatedFeatures.length > 0 ? (
          <>
            <FeatureTable 
              data={paginatedFeatures} 
              onEdit={handleEdit}
              onRefresh={refetch}
            />
            
            <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalFeatures}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
          </>
        ) : (
          <div className="features-empty">
            <svg className="features-empty__icon" viewBox="0 0 24 24" fill="none">
              <path d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <h3>No hay características registradas</h3>
            <p>Comienza creando una nueva característica para asignar a los planes</p>
            <button className="features-empty__button" onClick={handleAdd}>
              Crear Característica
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AppModal
          title={selectedFeature ? 'Editar Característica' : 'Nueva Característica'}
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
          <FeatureForm 
            onSubmit={handleSubmit}
            initialData={selectedFeature}
            onCancel={handleCloseModal}
            isEditing={!!selectedFeature}
            isSubmitting={isCreating || isUpdating}
          />
        </AppModal>
      )}
    </div>
  )
}
