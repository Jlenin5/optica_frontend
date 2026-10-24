import { useMemo } from "react"
import { useAuthStore } from "@/app/store/auth.store"
import navigationConfig from "@/app/config/navigationConfig"
import { NAVIGATION_PERMISSIONS } from "@/app/config/navigationPermissions"
import type { NavItemType } from "@/app/types/navItemType.types"

export const useFilteredNavigation = () => {
  const { hasFeature, hasPermission } = useAuthStore()

  const filterNavItems = (items: NavItemType[]): NavItemType[] =>
    items
      .map(item => ({
        ...item,
        children: item.children ? filterNavItems(item.children) : undefined,
      }))
      .filter(item => {
        const permission = NAVIGATION_PERMISSIONS[item.id]
        const permissionAllowed = !permission || hasPermission(permission)
        const featureAllowed = !item.requiredFeature || hasFeature(item.requiredFeature)

        if (item.children) {
          return featureAllowed && (item.children.length > 0 || permissionAllowed)
        }
        return featureAllowed && permissionAllowed
      })

  return useMemo(
    () => filterNavItems(navigationConfig),
    [hasFeature, hasPermission],
  )
}
