export const generateFakeToken = (user: any) => {
  return btoa(JSON.stringify({
    sub: user.id,
    role: user.role,
    exp: Date.now() + 1000 * 60 * 60, // 1 hora
  }))
}

export const decodeFakeToken = (token: string) => {
  try {
    return JSON.parse(atob(token))
  } catch {
    return null
  }
}