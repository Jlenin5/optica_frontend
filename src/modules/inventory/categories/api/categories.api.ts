import http from "@/services/http"
import type { 
  Category, 
  GetCategoriesParams, 
  PaginatedResponse,
  CreateCategoryDTO,
  UpdateCategoryDTO,
  CategoryStats,
  UploadProgress
} from "../types/categories.types"

export const getCategories = async (params?: GetCategoriesParams): Promise<PaginatedResponse<Category>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    if (params?.status !== undefined) queryParams.append('status', String(params.status))
    if (params?.visible_on_web !== undefined) queryParams.append('visible_on_web', String(params.visible_on_web))
    if (params?.parent_id !== undefined) queryParams.append('parent_id', String(params.parent_id))
    if (params?.company_id) queryParams.append('company_id', String(params.company_id))
    
    const url = queryParams.toString() ? `/categories?${queryParams.toString()}` : '/categories'
    const response = await http.get<PaginatedResponse<Category>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

export const getCategoryById = async (id: number): Promise<Category> => {
  try {
    const response = await http.get<Category>(`/categories/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error)
    throw error
  }
}

export const createCategory = async (data: CreateCategoryDTO): Promise<Category> => {
  try {
    const response = await http.post<Category>('/categories', data)
    return response.data
  } catch (error) {
    console.error('Error creating category:', error)
    throw error
  }
}

export const updateCategory = async (id: number, data: UpdateCategoryDTO): Promise<Category> => {
  try {
    const response = await http.patch<Category>(`/categories/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating category ${id}:`, error)
    throw error
  }
}

export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await http.delete(`/categories/${id}`)
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error)
    throw error
  }
}

export const toggleCategoryStatus = async (id: number, status: boolean): Promise<Category> => {
  try {
    const response = await http.patch<Category>(`/categories/${id}/status`, { status })
    return response.data
  } catch (error) {
    console.error(`Error toggling category status ${id}:`, error)
    throw error
  }
}

export const toggleCategoryVisibility = async (id: number, visible_on_web: boolean): Promise<Category> => {
  try {
    const response = await http.patch<Category>(`/categories/${id}/visibility`, { visible_on_web })
    return response.data
  } catch (error) {
    console.error(`Error toggling category visibility ${id}:`, error)
    throw error
  }
}

export const getCategoryStats = async (companyId?: number): Promise<CategoryStats> => {
  try {
    const queryParams = new URLSearchParams()
    if (companyId) queryParams.append('company_id', String(companyId))
    
    const url = queryParams.toString() ? `/categories/stats?${queryParams.toString()}` : '/categories/stats'
    const response = await http.get<CategoryStats>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching category stats:', error)
    throw error
  }
}

export const uploadCategoryImage = async (
  id: number,
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<{ image: string }> => {
  try {
    const formData = new FormData()
    formData.append('image', file)
    const response = await http.patch<{ image: string }>(
      `/categories/${id}/image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (event) => {
          if (event.total && onProgress) {
            const percentage = (event.loaded / event.total) * 100
            onProgress({
              loaded: event.loaded,
              total: event.total,
              percentage
            })
          }
        }
      }
    )
    return response.data
  } catch (error) {
    console.error(`Error uploading image for category ${id}:`, error)
    throw error
  }
}

export const getCategoryTree = async (): Promise<Category[]> => {
  try {
    const response = await http.get<Category[]>('/categories/tree')
    return response.data
  } catch (error) {
    console.error('Error fetching category tree:', error)
    throw error
  }
}