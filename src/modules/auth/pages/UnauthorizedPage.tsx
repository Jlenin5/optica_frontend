import { Link, useLocation } from "react-router-dom"

export function UnauthorizedPage() {
  const location = useLocation()
  const permission = (location.state as { requiredPermission?: string } | null)?.requiredPermission

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ maxWidth: 560, textAlign: "center" }}>
        <h1>Acceso no autorizado</h1>
        <p>No tienes permisos suficientes para acceder a esta sección.</p>
        {permission && <small>Permiso requerido: {permission}</small>}
        <div style={{ marginTop: 20 }}>
          <Link to="/">Volver al inicio</Link>
        </div>
      </div>
    </div>
  )
}
