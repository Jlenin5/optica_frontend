// services/storage.ts
const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user'

export const getAccessToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export const setTokens = (tokens: { access: string; refresh?: string }) => {
  localStorage.setItem(TOKEN_KEY, tokens.access)
  if (tokens.refresh) localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh)
  else localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export const getUserStorage = () => {
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}

export const setUserStorage = (user: any) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}