import http from "@/services/http"

export const getProfile = async () => {
  const res = await http.get("/auth/profile")
  return res.data
}