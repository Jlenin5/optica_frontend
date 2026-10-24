import { useDeleteRole } from "../hooks/useDeleteRole"
import { useState } from "react"
import { PermissionGate } from "@/components/auth/PermissionGate"
import MuiSvgIcon from "@/components/MuiSvgIcon"

interface RoleTableProps {
  data: any[]
  onEdit: (role: any) => void
}

export const RoleTable = ({ data, onEdit }: RoleTableProps) => {
  const { mutate: deleteRole } = useDeleteRole()
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    deleteRole(id)
    setDeleteConfirm(null)
  }

  if (!data || data.length === 0) {
    return (
      <div className="role-table__empty">
        <p>No hay roles registrados</p>
        <span>Comienza creando un nuevo rol en el formulario</span>
      </div>
    )
  }

  return (
    <div className="role-table">
      <table className="role-table__content">
        <thead>
          <tr className="role-table__header">
            <th className="role-table__th">Nombre</th>
            <th className="role-table__th">Descripción</th>
            <th className="role-table__th role-table__th--actions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((role: any) => (
            <tr key={role.id} className="role-table__row">
              <td className="role-table__td role-table__td--name">
                <strong>{role.name}</strong>
              </td>
              <td className="role-table__td role-table__td--description">
                {role.description || '—'}
              </td>
              <td className="role-table__td role-table__td--actions">
                <PermissionGate permission="roles.update">
                  <button
                    onClick={() => onEdit(role)}
                    className="role-table__action role-table__action--edit"
                    title="Editar rol"
                  >
                    <MuiSvgIcon size={16}>lucide:pencil</MuiSvgIcon>
                  </button>
                </PermissionGate>
                
                <PermissionGate permission="roles.delete">
                {deleteConfirm === role.id ? (
                  <div className="role-table__confirm">
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="role-table__action role-table__action--confirm"
                    >
                      <MuiSvgIcon size={16}>lucide:check</MuiSvgIcon>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="role-table__action role-table__action--cancel"
                    >
                      <MuiSvgIcon size={16}>lucide:x</MuiSvgIcon>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(role.id)}
                    className="role-table__action role-table__action--delete"
                    title="Eliminar rol"
                  >
                    <MuiSvgIcon size={16}>lucide:trash-2</MuiSvgIcon>
                  </button>
                )}
                </PermissionGate>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}