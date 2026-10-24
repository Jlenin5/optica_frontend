import http from "@/services/http"

export const refreshToken = async (refresh: string) => {
  const res = await http.post("/auth/refresh", { refresh })
  return res.data
}