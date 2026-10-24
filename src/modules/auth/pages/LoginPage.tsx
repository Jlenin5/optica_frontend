import { useState } from "react"
import { useLogin } from "../hooks/useLogin"
import { useNavigate } from "react-router-dom"
import "@styles/login.scss"
import MuiSvgIcon from '@components/MuiSvgIcon'

export const LoginPage = () => {
  const { mutate, isPending, error } = useLogin()
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    mutate(
      { username, password },
      {
        onSuccess: () => {
          if (rememberMe) {
            localStorage.setItem("rememberMe", "true")
          }
          navigate("/")
        },
      }
    )
  }

  const handleForgotPassword = () => {
    // Navegar a página de recuperación o abrir modal
    console.log("Recuperar contraseña")
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Sección de imagen */}
        <div className="login-image">
          <div className="login-image__overlay">
            <div className="login-image__content">
              <div className="login-logo">
                <svg className="login-logo__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="currentColor" opacity="0.2"/>
                  <path d="M12 6v6l4 2M12 6v6l-4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <h1 className="login-logo__text">Óptica ERP</h1>
              </div>
              <p className="login-image__quote">
                "La visión perfecta para tu negocio"
              </p>
              <div className="login-image__features">
                <div className="login-feature">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Gestión Óptica</span>
                </div>
                <div className="login-feature">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 8V12L15 15M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Control Total</span>
                </div>
                <div className="login-feature">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Reportes Avanzados</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección del formulario */}
        <div className="login-form-section">
          <div className="login-form-container">
            <div className="login-header">
              <h2 className="login-title">Bienvenido</h2>
              <p className="login-subtitle">Ingresa tus credenciales para acceder al sistema</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Usuario
                </label>
                <div className="input-wrapper">
                  <MuiSvgIcon className="input-icon" size={24}>
                    heroicons-outline:user-circle
                  </MuiSvgIcon>
                  <input
                    id="username"
                    type="text"
                    className="form-input"
                    placeholder="Nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <div className="input-wrapper">
                  <MuiSvgIcon className="input-icon" size={24}>
                    heroicons-outline:key
                  </MuiSvgIcon>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <MuiSvgIcon size={24}>
                        heroicons-outline:eye
                      </MuiSvgIcon>
                    ) : (
                      <MuiSvgIcon size={24}>
                        heroicons-outline:eye-slash
                      </MuiSvgIcon>
                    )}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Recordarme</span>
                </label>
                <button
                  type="button"
                  className="forgot-password"
                  onClick={handleForgotPassword}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {error && (
                <div className="error-message">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 8V12M12 16H12.01M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>{error.message || "Error al iniciar sesión. Verifica tus credenciales."}</span>
                </div>
              )}

              <button
                type="submit"
                className="login-button"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="spinner"></span>
                    Ingresando...
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </button>
            </form>

            <div className="login-footer">
              <p className="footer-text">
                ¿No tienes una cuenta?{" "}
                <button type="button" className="signup-link">
                  Contacta al administrador
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}