export type AppMode = 'demo' | 'production'

const STORAGE_KEY = 'optica-app-mode'

export const getAppMode = (): AppMode => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'demo' || saved === 'production') return saved
  return import.meta.env.VITE_APP_MODE === 'production' ? 'production' : 'demo'
}

export const isDemoMode = () => getAppMode() === 'demo'

export const setAppMode = (mode: AppMode) => {
  localStorage.setItem(STORAGE_KEY, mode)
}
