import http from "@/services/http"
import type { 
  Product, 
  GetProductsParams, 
  PaginatedResponse,
  CreateProductDTO,
  UpdateProductDTO,
  ProductStats,
  ProductImage
} from "../types/products.types"

export const getProducts = async (params?: GetProductsParams): Promise<PaginatedResponse<Product>> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.offset) queryParams.append('offset', String(params.offset))
    if (params?.search) queryParams.append('search', params.search)
    if (params?.status !== undefined) queryParams.append('status', String(params.status))
    if (params?.product_type) queryParams.append('product_type', params.product_type)
    if (params?.category_id) queryParams.append('category_id', String(params.category_id))
    if (params?.brand_id) queryParams.append('brand_id', String(params.brand_id))
    if (params?.company_id) queryParams.append('company_id', String(params.company_id))
    if (params?.low_stock) queryParams.append('low_stock', 'true')
    if (params?.min_price) queryParams.append('min_price', String(params.min_price))
    if (params?.max_price) queryParams.append('max_price', String(params.max_price))
    
    const url = queryParams.toString() ? `/products?${queryParams.toString()}` : '/products'
    const response = await http.get<PaginatedResponse<Product>>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await http.get<Product>(`/products/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error)
    throw error
  }
}

export const createProduct = async (data: CreateProductDTO): Promise<Product> => {
  try {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value))
      }
    })

    const response = await http.post<Product>('/products', formData, {
      headers: {
      'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error creating product:', error) 
    throw error
  }
}

export const updateProduct = async (id: number, data: UpdateProductDTO): Promise<Product> => {
  try {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value))
      }
    })

    const response = await http.patch<Product>(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    console.error(`Error updating product ${id}:`, error)
    throw error
  }
}

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await http.delete(`/products/${id}`)
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error)
    throw error
  }
}

export const toggleProductStatus = async (id: number, status: boolean): Promise<Product> => {
  try {
    const response = await http.patch<Product>(`/products/${id}/status`, { status })
    return response.data
  } catch (error) {
    console.error(`Error toggling product status ${id}:`, error)
    throw error
  }
}

export const getProductStats = async (companyId?: number): Promise<ProductStats> => {
  try {
    const queryParams = new URLSearchParams()
    if (companyId) queryParams.append('company_id', String(companyId))
    
    const url = queryParams.toString() ? `/products/stats?${queryParams.toString()}` : '/products/stats'
    const response = await http.get<ProductStats>(url)
    return response.data
  } catch (error) {
    console.error('Error fetching product stats:', error)
    throw error
  }
}

export const uploadProductImage = async (id: number, file: File): Promise<{ images: ProductImage[] }> => {
  try {
    const formData = new FormData()
    formData.append('image', file)
    const response = await http.post<{ images: ProductImage[] }>(`/products/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error(`Error uploading image for product ${id}:`, error)
    throw error
  }
}

export const deleteProductImage = async (id: number, imageId: string): Promise<void> => {
  try {
    await http.delete(`/products/${id}/images/${imageId}`)
  } catch (error) {
    console.error(`Error deleting image for product ${id}:`, error)
    throw error
  }
}

export const setFeaturedImage = async (id: number, imageId: string): Promise<Product> => {
  try {
    const response = await http.patch<Product>(`/products/${id}/featured-image`, { featured_image: imageId })
    return response.data
  } catch (error) {
    console.error(`Error setting featured image for product ${id}:`, error)
    throw error
  }
}