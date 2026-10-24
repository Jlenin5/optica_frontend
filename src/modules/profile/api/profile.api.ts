import http from "@/services/http"
import type { Profile, UpdateProfileDTO, ChangePasswordDTO } from "../types/profile.types"

export const getProfile = async (): Promise<Profile> => {
  try {
    const response = await http.get<Profile>('/profile')
    return response.data
  } catch (error) {
    console.error('Error fetching profile:', error)
    throw error
  }
}

export const updateProfile = async (data: UpdateProfileDTO): Promise<Profile> => {
  try {
    const response = await http.patch<Profile>('/profile', data)
    return response.data
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}

export const changePassword = async (data: ChangePasswordDTO): Promise<{ message: string }> => {
  try {
    const response = await http.post<{ message: string }>('/profile/change-password', data)
    return response.data
  } catch (error) {
    console.error('Error changing password:', error)
    throw error
  }
}

export const uploadAvatar = async (file: File): Promise<{ avatar: string }> => {
  try {
    const formData = new FormData()
    formData.append('avatar', file)
    const response = await http.post<{ avatar: string }>('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error uploading avatar:', error)
    throw error
  }
}