import { useEffect, useMemo, useState } from "react"
import { usePermissionsCatalog } from "@/modules/permissions/hooks/usePermissionsCatalog"
import type { Role, RolePayload } from "../types/roles.types"
import type { Permission } from "@/modules/permissions/types/permissions.types"
import { usePermissions } from "@/hooks/usePermissions"

interface RoleFormProps {
  onSubmit: (data: RolePayload) => void
  initialData?: Role | null
  onCancel?: () => void
  isEditing?: boolean
}

const ACTION_LABELS: Record<string, string> = {
  view: "Ver",
  create: "Crear",
  update: "Editar",
  delete: "Eliminar",
  manage_permissions: "Gestionar permisos",
}

export const RoleForm = ({ onSubmit, initialData, onCancel, isEditing }: RoleFormProps) => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState(true)
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
  const [errors, setErrors] = useState<{ name?: string }>({})
  const { data, isLoading } = usePermissionsCatalog()
  const { hasPermission } = usePermissions()
  const canManagePermissions = hasPermission("roles.manage_permissions")

  useEffect(() => {
    setName(initialData?.name ?? "")
    setDescription(initialData?.description ?? "")
    setStatus(initialData?.status ?? true)
    setSelectedPermissions(
      initialData?.permission_ids ??
      initialData?.permissions?.map(permission => permission.id) ??
      []
    )
  }, [initialData])

  const permissions = data?.results ?? []

  const groupedPermissions = useMemo(() => {
    const groups: Record<string, typeof permissions> = {}
    for (const permission of permissions) {
      ;(groups[permission.resource] ??= []).push(permission)
    }
    return groups
  }, [permissions])

  const togglePermission = (id: number) => {
    setSelectedPermissions(current =>
      current.includes(id) ? current.filter(value => value !== id) : [...current, id]
    )
  }

  const toggleResource = (permissions: Permission[]) => {
    const ids = permissions.map(permission => permission.id)
    const allSelected = ids.every(id => selectedPermissions.includes(id))
    setSelectedPermissions(current =>
      allSelected
        ? current.filter(id => !ids.includes(id))
        : Array.from(new Set([...current, ...ids]))
    )
  }

  const validate = () => {
    const next: { name?: string } = {}
    if (!name.trim()) next.name = "El nombre es requerido"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!validate()) return
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      status,
      permission_ids: canManagePermissions ? selectedPermissions : (initialData?.permission_ids ?? initialData?.permissions?.map(permission => permission.id) ?? []),
    })
    if (!isEditing) {
      setName("")
      setDescription("")
      setSelectedPermissions([])
    }
  }

  return (
    <form className="role-form" onSubmit={handleSubmit}>
      <div className="role-form__field">
        <label className="role-form__label">Nombre *</label>
        <input
          className={`role-form__input ${errors.name ? "role-form__input--error" : ""}`}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Ej: Administrador de tienda"
        />
        {errors.name && <span className="role-form__error">{errors.name}</span>}
      </div>

      <div className="role-form__field">
        <label className="role-form__label">Descripción</label>
        <textarea
          className="role-form__textarea"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          placeholder="Responsabilidades del rol..."
        />
      </div>

      <div className="role-form__field">
        <label className="role-form__checkbox">
          <input type="checkbox" checked={status} onChange={e => setStatus(e.target.checked)} />
          Rol activo
        </label>
      </div>

      <section className="role-permissions">
        <div className="role-permissions__header">
          <div>
            <h4>Permisos del rol</h4>
            <p>El usuario heredará la unión de los permisos de todos sus roles.</p>
            {!canManagePermissions && <small>No tienes permiso para modificar la matriz de permisos.</small>}
          </div>
          <strong>{selectedPermissions.length} seleccionados</strong>
        </div>

        {isLoading ? (
          <p>Cargando catálogo de permisos...</p>
        ) : (
          <div className="role-permissions__grid">
            {Object.entries(groupedPermissions).map(([resource, permissions]) => {
              const ids = permissions.map(permission => permission.id)
              const allSelected = ids.length > 0 && ids.every(id => selectedPermissions.includes(id))
              return (
                <div className="role-permissions__resource" key={resource}>
                  <label className="role-permissions__resource-title">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      disabled={!canManagePermissions}
                      onChange={() => toggleResource(permissions)}
                    />
                    <span>{resource}</span>
                  </label>
                  <div className="role-permissions__actions">
                    {permissions.map(permission => (
                      <label key={permission.id} className="role-permissions__permission">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission.id)}
                          disabled={!canManagePermissions}
                          onChange={() => togglePermission(permission.id)}
                        />
                        {ACTION_LABELS[permission.action] ?? permission.action}
                      </label>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <div className="role-form__actions">
        {isEditing && (
          <button type="button" className="role-form__button role-form__button--secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
        <button type="submit" className="role-form__button role-form__button--primary">
          {isEditing ? "Actualizar" : "Guardar"} Rol
        </button>
      </div>
    </form>
  )
}
