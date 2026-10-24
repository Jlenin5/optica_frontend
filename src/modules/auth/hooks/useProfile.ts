import { useQuery } from "@tanstack/react-query"
import { getProfile } from "../api/profile.api"
import { useAuthStore } from "@/app/store/auth.store"

export const useProfile = () => {
  const setUser = useAuthStore((s) => s.setUser)

  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    select: (data) => {
      setUser(data)
      return data
    },
  })
}