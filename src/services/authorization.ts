import { useAuthStore } from "@/app/store/auth.store"

const METHOD_ACTION: Record<string, string> = {
  GET: "view",
  POST: "create",
  PUT: "update",
  PATCH: "update",
  DELETE: "delete",
}

const SPECIAL: Array<{ suffix: string; method?: string; permission: string }> = [
  { suffix: "/permissions", permission: "roles.manage_permissions" },
]

export function permissionForApiRequest(url = "", method = "GET"): string | null {
  const clean = url.split("?")[0].replace(/^\//, "")
  if (!clean || clean.startsWith("auth/") || clean.startsWith("sign-in")) return null

  for (const rule of SPECIAL) {
    if (clean.endsWith(rule.suffix) && (!rule.method || rule.method === method)) return rule.permission
  }

  const parts = clean.split("/").filter(Boolean)
  const apiIndex = parts.indexOf("api")
  const resource = apiIndex >= 0 ? parts[apiIndex + 1] : parts[0]
  if (!resource || resource === "permissions") return null
  const action = METHOD_ACTION[method]
  return action ? `${resource}.${action}` : null
}

export function canAuthorizeApiRequest(url?: string, method = "GET") {
  const permission = permissionForApiRequest(url, method.toUpperCase())
  if (!permission) return true
  return useAuthStore.getState().hasPermission(permission)
}
