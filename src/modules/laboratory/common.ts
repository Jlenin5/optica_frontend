export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export const unwrapResults = <T,>(data: PaginatedResponse<T> | T[]): T[] =>
  Array.isArray(data) ? data : data.results
