export interface TypeOfDocument {
  id: number
  description: string
  abbreviation?: string | null
  code?: string
  status: boolean
  created_at: string
  updated_at?: string
}

export interface CreateTypeOfDocumentDTO {
  description: string
  abbreviation?: string
  code?: string
  status?: boolean
}

export interface UpdateTypeOfDocumentDTO {
  description?: string
  abbreviation?: string
  code?: string
  status?: boolean
}

export interface GetTypeOfDocumentsParams {
  limit?: number
  offset?: number
  search?: string
  status?: boolean
}

export interface TypeOfDocumentsResponse {
  data: TypeOfDocument[]
  total: number
  limit: number
  offset: number
}