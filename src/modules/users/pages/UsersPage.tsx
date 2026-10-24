import { useDebounce } from "@/hooks/useDebounce"
import { ModulePagination, useModulePagination } from "@/components/ui/module/ModulePagination"
import { AppModal } from '@/components/ui/modal'
import { useEffect, useState, useCallback, useMemo, useRef } from "react"
import { useUsers } from "../hooks/useUsers"
import { useCreateUser } from "../hooks/useCreateUser"
import { useUpdateUser } from "../hooks/useUpdateUser"
import { UserTable } from "../components/UserTable"
import { UserForm } from "../components/UserForm"
import { UserFilters } from "../components/UserFilters"
import { UserSkeleton } from "../components/UserSkeleton"
import { UserLimitWarning } from "../components/UserLimitWarning"
import type { User, CreateUserDTO, UpdateUserDTO } from "../types/users.types"
import "@styles/users.scss"
import { useAuthStore } from "@/app/store/auth.store"
import { useCheckLimits } from "@/hooks/useCheckLimits"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { PermissionGate } from '@/components/auth/PermissionGate'
import { Button } from '@/components/ui/Button'

export const UsersPage = () => {
  const { user, getLimitValue, plan, isSuperAdmin: userIsSuperAdmin } = useAuthStore()
  const { checkLimitBeforeAction } = useCheckLimits()

  // Estado local para límites
  const [maxUsers, setMaxUsers] = useState<number | null>(null)
  const [isLoadingLimits, setIsLoadingLimits] = useState(true)
  const [limitsLoaded, setLimitsLoaded] = useState(false)
  const limitsLoadAttempted = useRef(false)
  
  // Estado del componente
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 350)
  const [status, setStatus] = useState<boolean | undefined>(undefined)
  const [roleId, setRoleId] = useState<number | undefined>(undefined)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentUsersCount, setCurrentUsersCount] = useState(0)
  const [showWarning, setShowWarning] = useState(true)

  // Consultas y mutaciones
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useUsers({
    search: debouncedSearch || undefined,
    status,
    role_id: roleId
  })
  
  const { mutate: createUser, isPending: isCreating } = useCreateUser()
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser()

  useEffect(() => {
    const loadLimits = async () => {
      if (limitsLoadAttempted.current) return
      limitsLoadAttempted.current = true
      
      try {
        const limitValue = getLimitValue('max_users')
        setMaxUsers(limitValue !== undefined && limitValue !== null ? limitValue : null)
      } catch (error) {
        console.error('Error loading limits:', error)
        setMaxUsers(null)
      } finally {
        setIsLoadingLimits(false)
        setLimitsLoaded(true)
      }
    }
    
    loadLimits()
  }, [getLimitValue])

  // Calcular límites
  const isSuperAdmin = userIsSuperAdmin || user?.is_superuser === true

  const canAddMoreUsers = useMemo(() => {
    if (isSuperAdmin) return true
    if (isLoadingLimits) return false
    return maxUsers === null || currentUsersCount < maxUsers
  }, [isSuperAdmin, isLoadingLimits, maxUsers, currentUsersCount])

  const shouldShowWarning = useMemo(() => {
    if (isSuperAdmin) return false
    if (isLoadingLimits || !limitsLoaded) return false
    if (!showWarning) return false
    if (maxUsers === null) return false
    if (currentUsersCount === 0) return false
    return currentUsersCount >= maxUsers - 1
  }, [isSuperAdmin, isLoadingLimits, limitsLoaded, showWarning, maxUsers, currentUsersCount])

  const getUsagePercentage = useMemo(() => {
    if (isSuperAdmin) return 0
    if (isLoadingLimits || !limitsLoaded) return 0
    if (!maxUsers || maxUsers === 0) return 0
    return (currentUsersCount / maxUsers) * 100
  }, [isSuperAdmin, isLoadingLimits, limitsLoaded, currentUsersCount, maxUsers])

  // Obtener datos de la API
  const allUsers = data?.pages.flatMap(page => page.results) || []
  const totalUsers = data?.pages[0]?.count || 0
  const { visibleData: paginatedUsers, page: currentPage, pageCount, pageSize, setPage: setCurrentPage, setPageSize } = useModulePagination({
    data: allUsers, total: totalUsers, fetchNextPage, hasNextPage, isFetchingNextPage,
  })

  // Actualizar contador de usuarios
  useEffect(() => {
    if (data?.pages[0]?.count !== undefined) {
      const newCount = data.pages[0].count
      setCurrentUsersCount(newCount)
    }
  }, [data])

  // Handlers
  const handleSubmit = useCallback((userData: CreateUserDTO | UpdateUserDTO) => {
    if (selectedUser) {
      updateUser(
        { id: selectedUser.id, data: userData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setSelectedUser(null)
          }
        }
      )
    } else {
      createUser(userData as CreateUserDTO, {
        onSuccess: () => {
          setIsModalOpen(false)
        }
      })
    }
  }, [selectedUser, updateUser, createUser])

  const handleEdit = useCallback((user: User) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }, [])

  const handleAdd = useCallback(() => {
    // Si es super_admin, puede crear usuarios sin límite
    if (!isSuperAdmin) {
      if (isLoadingLimits || !limitsLoaded) {
        return
      }
      if (!checkLimitBeforeAction('max_users', currentUsersCount, 'crear usuarios')) {
        return
      }
    }
    
    setSelectedUser(null)
    setIsModalOpen(true)
  }, [isSuperAdmin, isLoadingLimits, limitsLoaded, checkLimitBeforeAction, currentUsersCount])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearch("")
    setStatus(undefined)
    setRoleId(undefined)
  }, [])

  const handleCloseWarning = useCallback(() => {
    setShowWarning(false)
  }, [])
  
  // Renderizado condicional
  if ((isLoading && !data) || isLoadingLimits || !limitsLoaded) {
    return <UserSkeleton />
  }

  return (
    <div className="users-page">
      {shouldShowWarning && maxUsers !== null && currentUsersCount > 0 && (
        <UserLimitWarning
          maxUsers={maxUsers}
          currentCount={currentUsersCount}
          usagePercentage={getUsagePercentage}
          planName={plan?.name}
          isSuperAdmin={isSuperAdmin}
          onClose={handleCloseWarning}
        />
      )}

      {/* Header */}
      <div className="users-page__header">
        <div className="users-page__header-left">
          <h1 className="users-page__title">
            Usuarios
          </h1>
        </div>
        <PermissionGate permission="users.create">
        <button 
          className="add-button" 
          onClick={handleAdd}
          disabled={!canAddMoreUsers}
        >
          <MuiSvgIcon size={18}>
            lucide:plus
          </MuiSvgIcon>
          Agregar
          {!canAddMoreUsers && !isSuperAdmin && (
            <span className="add-badge">Límite alcanzado</span>
          )}
        </button>
        </PermissionGate>
      </div>

      {/* Filters */}
      <UserFilters
        searchTerm={search}
        onSearchChange={setSearch}
        statusFilter={status}
        onStatusFilterChange={setStatus}
        roleId={roleId}
        onRoleIdChange={setRoleId}
        onClearFilters={handleClearFilters}
        totalResults={totalUsers}
      />

      {/* Users Table */}
      <div className="users-page__content">
        {paginatedUsers.length > 0 ? (
          <>            
            <UserTable
              data={paginatedUsers} 
              onEdit={handleEdit}
              onRefresh={refetch}
              isSuperAdmin={isSuperAdmin}
            />
            
            <ModulePagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              total={totalUsers}
              setPage={setCurrentPage}
              setPageSize={setPageSize}
              isLoading={isFetchingNextPage}
            />
          </>
        ) : (
          <div className="users-empty">
            <h3>No hay usuarios registrados</h3>
            <p>Comienza creando un nuevo usuario en el sistema</p>
            <PermissionGate permission="users.create">
              <button 
                className="users-empty__button" 
                onClick={handleAdd}
                disabled={!canAddMoreUsers}
              >
                Crear Usuario
              </button>
            </PermissionGate>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AppModal
          title={selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
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
          <UserForm 
            onSubmit={handleSubmit}
            initialData={selectedUser}
            onCancel={handleCloseModal}
            isEditing={!!selectedUser}
            isSubmitting={isCreating || isUpdating}
          />
        </AppModal>
      )}
    </div>
  )
}
