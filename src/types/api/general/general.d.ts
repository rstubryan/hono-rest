// ================================
// STATUS CODES
// ================================

export type StatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 422 | 429 | 500

export type ApiStatus =
  | 'success'
  | 'created'
  | 'bad_request'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'validation_error'
  | 'rate_limit_exceeded'
  | 'internal_error'

// ================================
// API RESPONSE
// ================================

export type SuccessApiResponse<T = unknown> = {
  code: StatusCode
  status: ApiStatus
  message: string
  meta?: {
    page?: number
    limit?: number
    total_pages?: number
    total_results?: number
  }
  data: T
}

export type ErrorApiResponse = {
  code: StatusCode
  status: ApiStatus
  message: string
  errors?: Array<{
    field: string
    message: string
  }>
}

export type BaseApiResponse<T = unknown> = ErrorApiResponse | SuccessApiResponse<T>

// ================================
// REQUEST
// ================================

export type PaginationQuery = {
  page?: number
  limit?: number
}

// ================================
// COMMON FIELDS
// ================================

export type Timestamps = {
  created_at?: string
  updated_at?: string
}

export type Metadata = {
  created_by?: string
  updated_by?: string
}

export type Assignable = {
  assigned_at?: string
  assigned_by?: string
}

export type WithTimestamps<T> = T & Timestamps

export type WithMetadata<T> = T & Metadata

export type WithAssignable<T> = T & Assignable

// ================================
// JWT
// ================================

export type JWTPayload = {
  sub: string
  email: string
  iat?: number
  exp?: number
}
