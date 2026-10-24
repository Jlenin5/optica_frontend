import { QueryProvider } from "./providers/QueryProvider"
import { AuthorizationProvider } from "./providers/AuthorizationProvider"
import { AppRouter } from "@/routes/AppRouter"
import { useAuthStore } from "./store/auth.store"
import { useEffect } from "react"

function App() {

  const initAuth = useAuthStore((state) => state.initAuth)
  const user = useAuthStore((state) => state.user)
  const isInitialized = useAuthStore((state) => state.isInitialized)

  useEffect(() => {
    initAuth()
  }, [initAuth])

  useEffect(() => {
    if (isInitialized) {
      // console.log('Autenticación inicializada, usuario:', user)
    }
  }, [isInitialized, user])

  if (!isInitialized) {
    return <div>Cargando app...</div>
  }
  
  return (
    <QueryProvider>
      <AuthorizationProvider>
        <AppRouter />
      </AuthorizationProvider>
    </QueryProvider>
  )
}

export default App