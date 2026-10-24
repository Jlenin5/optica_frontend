import { create } from "zustand"
import { persist } from "zustand/middleware"
import { getAccessToken, getUserStorage, clearTokens, setUserStorage, setTokens } from "@/services/storage"
import type { User } from "@/modules/users/types/users.types"
import type { Plan } from "@/modules/billing/plans/types/plans.types"

export interface AuthUser extends User {
  plan?: Plan | null
  features?: string[]
  limits?: Record<string, number>
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isInitialized: boolean
  features: string[]
  limits: Record<string, number>
  plan: Plan | null
  currentCompanyId: number | null
  isSuperAdmin: boolean
  permissions: string[]
  login: (user: AuthUser, tokens: { access: string; refresh?: string }, extraData: {
    features?: string[]
    limits?: Record<string, number>
    plan?: Plan | null
    permissions?: string[]
    roles?: User["roles"]
  }) => void
  setUser: (user: AuthUser) => void
  setPermissions: (permissions: string[]) => void
  logout: () => void
  initAuth: () => void
  hasFeature: (feature: string) => boolean
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  hasAllPermissions: (permissions: string[]) => boolean
  hasRole: (role: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
  checkLimit: (limitKey: string, currentValue: number) => boolean
  getLimitValue: (limitKey: string) => number | null
}

const normalizePermissions = (user: AuthUser | null, explicit: string[] = []) => {
  if (user?.is_superuser) return ["*"]
  return Array.from(new Set([
    ...(user?.permissions ?? []),
    ...(user?.permission_codes ?? []),
    ...explicit,
  ]))
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isInitialized: false,
      features: [],
      limits: {},
      plan: null,
      currentCompanyId: null,
      isSuperAdmin: false,
      permissions: [],

      login: (user, tokens, extraData) => {
        const permissions = normalizePermissions(user, extraData.permissions)
        const userWithAccess = {
          ...user,
          permissions,
          permission_codes: permissions,
          roles: extraData.roles ?? user.roles ?? [],
          limits: extraData.limits ?? {},
          features: extraData.features ?? [],
          plan: extraData.plan ?? null,
        }
        setTokens(tokens)
        setUserStorage(userWithAccess)
        set({
          user: userWithAccess,
          isAuthenticated: true,
          isInitialized: true,
          features: userWithAccess.features ?? [],
          limits: userWithAccess.limits ?? {},
          plan: userWithAccess.plan ?? null,
          currentCompanyId: userWithAccess.company_id ?? null,
          isSuperAdmin: !!userWithAccess.is_superuser,
          permissions,
        })
      },

      setUser: (user) => {
        const permissions = normalizePermissions(user)
        const userWithAccess = { ...user, permissions, permission_codes: permissions }
        setUserStorage(userWithAccess)
        set({
          user: userWithAccess,
          isAuthenticated: true,
          currentCompanyId: user.company_id ?? null,
          isSuperAdmin: !!user.is_superuser,
          limits: user.limits ?? {},
          features: user.features ?? [],
          plan: user.plan ?? null,
          permissions,
        })
      },

      setPermissions: (permissions) => {
        const normalized = Array.from(new Set(permissions))
        const user = get().user
        const updated = user ? { ...user, permissions: normalized, permission_codes: normalized } : null
        if (updated) setUserStorage(updated)
        set({ permissions: normalized, user: updated })
      },

      logout: () => {
        clearTokens()
        set({
          user: null, isAuthenticated: false, isInitialized: true,
          features: [], limits: {}, plan: null, currentCompanyId: null,
          isSuperAdmin: false, permissions: [],
        })
      },

      initAuth: () => {
        const token = getAccessToken()
        const user = getUserStorage() as AuthUser | null
        if (token && user) {
          const permissions = normalizePermissions(user)
          set({
            user: { ...user, permissions, permission_codes: permissions },
            isAuthenticated: true,
            isInitialized: true,
            features: user.features ?? [],
            limits: user.limits ?? {},
            plan: user.plan ?? null,
            currentCompanyId: user.company_id ?? null,
            isSuperAdmin: !!user.is_superuser,
            permissions,
          })
        } else {
          clearTokens()
          set({
            user: null, isAuthenticated: false, isInitialized: true,
            features: [], limits: {}, plan: null, currentCompanyId: null,
            isSuperAdmin: false, permissions: [],
          })
        }
      },

      hasFeature: (feature) => get().features.includes(feature),
      hasPermission: (permission) => {
        const permissions = get().permissions
        return get().isSuperAdmin || permissions.includes("*") || permissions.includes(permission)
      },
      hasAnyPermission: (permissions) => permissions.some(p => get().hasPermission(p)),
      hasAllPermissions: (permissions) => permissions.every(p => get().hasPermission(p)),
      hasRole: (role) => get().user?.roles?.some(r => r.name === role) || get().user?.role?.name === role || false,
      hasAnyRole: (roles) => roles.some(role => get().hasRole(role)),

      checkLimit: (limitKey, currentValue) => {
        const maxValue = get().limits[limitKey]
        return maxValue === undefined || maxValue === null || currentValue < maxValue
      },
      getLimitValue: (limitKey) => get().limits[limitKey] ?? null,
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        features: state.features,
        limits: state.limits,
        plan: state.plan,
        currentCompanyId: state.currentCompanyId,
        isSuperAdmin: state.isSuperAdmin,
        permissions: state.permissions,
      }),
    }
  )
)
