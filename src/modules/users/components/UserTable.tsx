import { useState } from "react"
import { useDeleteUser } from "../hooks/useDeleteUser"
import { useToggleUserStatus } from "../hooks/useToggleUserStatus"
import type { User } from "../types/users.types"
import MuiSvgIcon from '@components/MuiSvgIcon'
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { PermissionGate } from "@/components/auth/PermissionGate"

const api = import.meta.env.VITE_MEDIA_BASE_URL

interface UserTableProps {
  data: User[]
  onEdit: (user: User) => void
  onRefresh: () => void
  isSuperAdmin: boolean
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy", { locale: es })
}

export const UserTable = ({ data, onEdit, onRefresh, isSuperAdmin }: UserTableProps) => {
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser()
  const { mutate: toggleStatus, isPending: isToggling } = useToggleUserStatus()
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      setDeletingId(id)
      deleteUser(id, {
        onSuccess: () => {
          onRefresh()
        },
        onSettled: () => {
          setDeletingId(null)
        }
      })
    }
  }

  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    setTogglingId(id)
    toggleStatus({ id, status: !currentStatus }, {
      onSuccess: () => {
        onRefresh()
      },
      onSettled: () => {
        setTogglingId(null)
      }
    })
  }

  const getRoleBadgeClass = (roleName?: string) => {
    if (!roleName) return 'user-table__role-badge--default'
    const roleMap: Record<string, string> = {
      'admin': 'user-table__role-badge--admin',
      'super_admin': 'user-table__role-badge--super-admin',
      'manager': 'user-table__role-badge--manager',
      'user': 'user-table__role-badge--user'
    }
    return roleMap[roleName.toLowerCase()] || 'user-table__role-badge--default'
  }

  return (
    <div className="user-table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            {
              isSuperAdmin && (
                <th>Empresa</th>
              )
            }
            <th>Estado</th>
            <th>Fecha Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((user) => (
            <tr key={user?.id || null}>
              <td className="user-table__user">
                <div className="user-table__user-info">
                  <div className="user-table__avatar">
                    {user?.avatar ? (
                      <img src={api + user.avatar} alt={user.username} />
                    ) : (
                      <span>{user?.username?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <div className="user-table__username">
                      <strong>{user?.username}</strong>
                      {user?.is_superuser && (
                        <span className="user-table__superuser-badge">Super Admin</span>
                      )}
                      {user?.is_staff && !user?.is_superuser && (
                        <span className="user-table__staff-badge">Staff</span>
                      )}
                    </div>
                    <div className="user-table__email-small">{user?.email}</div>
                  </div>
                </div>
              </td>
              <td className="user-table__email">
                <a href={`mailto:${user?.email}`} className="user-table__email-link">
                  {user?.email}
                </a>
              </td>
              <td className="user-table__role">
                <div className="user-table__roles">
                  {(user?.roles?.length ? user.roles : user?.role ? [user.role] : []).map(role => (
                    <span key={role.id} className={`user-table__role-badge ${getRoleBadgeClass(role.name)}`}>
                      {role.name}
                    </span>
                  ))}
                  {!user?.roles?.length && !user?.role && <span>Sin rol</span>}
                </div>
              </td>
              {
                isSuperAdmin && (
                  <td className="user-table__company">
                    {user?.company?.name || '-'}
                  </td>
                )
              }
              <td className="user-table__status">
                <PermissionGate permission="users.update">
                <button
                  className={`user-table__status-badge user-table__status-badge--${user?.status ? 'active' : 'inactive'}`}
                  onClick={() => handleToggleStatus(user?.id, user?.status)}
                  disabled={isToggling && togglingId === user?.id}
                >
                  {isToggling && togglingId === user?.id ? (
                    <span className="user-table__spinner-small"></span>
                  ) : (
                    <>
                      <span className="user-table__status-dot"></span>
                      {user?.status ? 'Activo' : 'Inactivo'}
                    </>
                  )}
                </button>
                </PermissionGate>
              </td>
              <td className="user-table__created-at">
                {formatDate(user?.created_at)}
              </td>
              <td className="user-table__actions">
                <PermissionGate permission="users.update">
                <button
                  className="user-table__action-btn user-table__action-btn--edit"
                  onClick={() => onEdit(user)}
                  title="Editar usuario"
                >
                  <MuiSvgIcon size={18}>
                    heroicons-outline:pencil-square
                  </MuiSvgIcon>
                </button>
                <button
                  className="user-table__action-btn user-table__action-btn--delete"
                  onClick={() => handleDelete(user?.id)}
                  disabled={isDeleting && deletingId === user?.id}
                  title="Eliminar usuario"
                >
                  {isDeleting && deletingId === user?.id ? (
                    <span className="user-table__spinner"></span>
                  ) : (
                    <MuiSvgIcon size={18}>lucide:trash-2</MuiSvgIcon>
                  )}
                </button>
                </PermissionGate>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}