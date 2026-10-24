import http from "@/services/http"
import type { 
  Brand, 
  GetBrandsParams, 
  PaginatedResponse,
  CreateBrandDTO,
  UpdateBrandDTO,
  BrandStats,
  UploadProgress
} from "../types/brands.types"

export const getBrands = async (params?: GetBrandsParams): Promise<PaginatedResponse<Brand>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    if (params?.status !== undefined) queryParams.append('status', String(params.status))
    if (params?.visible_on_web !== undefined) queryParams.append('visible_on_web', String(params.visible_on_web))
    if (params?.company_id) queryParams.append('company_id', String(params.company_id))
    
    const url = queryParams.toString() ? `/brands?${queryParams.toString()}` : '/brands'
    const response = await http.get<PaginatedResponse<Brand>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching brands:', error)
    throw error
  }
}

export const getBrandById = async (id: number): Promise<Brand> => {
  try {
    const response = await http.get<Brand>(`/brands/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching brand ${id}:`, error)
    throw error
  }
}

export const createBrand = async (data: CreateBrandDTO, imageFile?: File | null): Promise<Brand> => {
  try {
    const formData = new FormData()
    
    // Agregar todos los campos del formulario
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value))
      }
    })
    
    // Agregar imagen si existe
    if (imageFile) {
      formData.append('logo_url', imageFile)
    }
    
    const response = await http.post<Brand>('/brands', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error creating brand:', error)
    throw error
  }
}

export const updateBrand = async (id: number, data: UpdateBrandDTO, imageFile?: File | null, removeLogo?: boolean): Promise<Brand> => {
  try {
    const formData = new FormData()
    
    // Agregar todos los campos del formulario
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value))
      }
    })
    
    // Agregar imagen si existe
    if (imageFile) {
      formData.append('logo_url', imageFile)
    }
    
    // Indicar si se debe remover el logo
    if (removeLogo) {
      formData.append('remove_logo', 'true')
    }
    
    const response = await http.put<Brand>(`/brands/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error(`Error updating brand ${id}:`, error)
    throw error
  }
}

export const deleteBrand = async (id: number): Promise<void> => {
  try {
    await http.delete(`/brands/${id}`)
  } catch (error) {
    console.error(`Error deleting brand ${id}:`, error)
    throw error
  }
}

export const toggleBrandStatus = async (id: number, status: boolean): Promise<Brand> => {
  try {
    const response = await http.patch<Brand>(`/brands/${id}/status`, { status })
    return response.data
  } catch (error) {
    console.error(`Error toggling brand status ${id}:`, error)
    throw error
  }
}

export const toggleBrandVisibility = async (id: number, visible_on_web: boolean): Promise<Brand> => {
  try {
    const response = await http.patch<Brand>(`/brands/${id}/visibility`, { visible_on_web })
    return response.data
  } catch (error) {
    console.error(`Error toggling brand visibility ${id}:`, error)
    throw error
  }
}

export const getBrandStats = async (companyId?: number): Promise<BrandStats> => {
  try {
    const queryParams = new URLSearchParams()
    if (companyId) queryParams.append('company_id', String(companyId))
    
    const url = queryParams.toString() ? `/brands/stats?${queryParams.toString()}` : '/brands/stats'
    const response = await http.get<BrandStats>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching brand stats:', error)
    throw error
  }
}

export const uploadBrandImage = async (
  id: number,
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<{ image: string }> => {
  const formData = new FormData()
  formData.append("image", file)

  const response = await http.patch<{ image: string }>(
    `/brands/${id}/image`,
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
}