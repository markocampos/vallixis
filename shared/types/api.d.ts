export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  meta: {
    timestamp: string
    request_id: string
  }
  errors?: Array<{ field: string; message: string }>
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: ApiResponse['meta'] & {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
