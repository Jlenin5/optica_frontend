import http from "@/services/http"
import type { 
  User,
  CreateUserDTO,
  UpdateUserDTO,
  GetUsersParams,
  UserStats
} from "../types/users.types"
import type { PaginatedResponse } from "@/types/global.types"

export const getUsers = async (params?: GetUsersParams): Promise<PaginatedResponse<User>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    if (params?.status !== undefined) queryParams.append('status', String(params.status))
    if (params?.role_id) queryParams.append('role_id', String(params.role_id))
    if (params?.role_name) queryParams.append('role_name', String(params.role_name))
    if (params?.company_id) queryParams.append('company_id', String(params.company_id))
    if (params?.branch_office_id) queryParams.append('branch_office_id', String(params.branch_office_id))
    if (params?.is_staff !== undefined) queryParams.append('is_staff', String(params.is_staff))
    if (params?.is_superuser !== undefined) queryParams.append('is_superuser', String(params.is_superuser))
    
    const url = queryParams.toString() ? `/users?${queryParams.toString()}` : '/users'
    const response = await http.get<PaginatedResponse<User>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

export const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await http.get<User>(`/users/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error)
    throw error
  }
}

export const createUser = async (data: CreateUserDTO): Promise<User> => {
  try {
    const response = await http.post<User>('/users', data)
    return response.data
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

export const updateUser = async (id: number, data: UpdateUserDTO): Promise<User> => {
  try {
    const response = await http.put<User>(`/users/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating user ${id}:`, error)
    throw error
  }
}

export const deleteUser = async (id: number): Promise<void> => {
  try {
    await http.delete(`/users/${id}`)
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error)
    throw error
  }
}

export const toggleUserStatus = async (id: number, status: boolean): Promise<User> => {
  try {
    const response = await http.patch<User>(`/users/${id}/status`, { status })
    return response.data
  } catch (error) {
    console.error(`Error toggling user status ${id}:`, error)
    throw error
  }
}

export const getUserStats = async (params?: { company_id?: number }): Promise<UserStats> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.company_id) {
      queryParams.append('company_id', String(params.company_id))
    }
    
    const url = queryParams.toString() ? `/users/stats?${queryParams.toString()}` : '/users/stats'
    
    const response = await http.get<UserStats>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching user stats:', error)
    throw error
  }
}