import { useAuthStore } from "@/app/store/auth.store"

export const useAuth = () => {
  const { 
    user, 
    isAuthenticated, 
    isInitialized,
    features,
    limits,
    plan,
    currentCompanyId,
    isSuperAdmin,
    logout,
    hasFeature,
    checkLimit,
    getLimitValue
  } = useAuthStore()

  return {
    user,
    isAuthenticated,
    isInitialized,
    features,
    limits,
    plan,
    currentCompanyId,
    isSuperAdmin,
    logout,
    hasFeature,
    checkLimit,
    getLimitValue
  }
}