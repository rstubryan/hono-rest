/**
 * API Response Standard
 *
 * Semua response API menggunakan format yang sama:
 * - Selalu ada field `code`, `status`, `message`, `data`
 * - `status` menggunakan specific status codes (lihat StatusCode type)
 * - `meta` bersifat opsional, ada jika perlu (pagination, dsb)
 */

/**
 * HTTP Status Codes
 */
export type StatusCode =
  | 200 // success
  | 201 // created
  | 400 // bad_request
  | 401 // unauthorized
  | 403 // forbidden
  | 404 // not_found
  | 422 // validation_error
  | 429 // rate_limit_exceeded
  | 500 // internal_error

/**
 * API Status Types
 */
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

/**
 * Success Response Structure
 */
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

/**
 * Error Response Structure
 */
export type ErrorApiResponse = {
  code: StatusCode
  status: ApiStatus
  message: string
  errors?: Array<{
    field: string
    message: string
  }>
}

/**
 * Base API Response (Success or Error)
 */
export type BaseApiResponse<T = unknown> = ErrorApiResponse | SuccessApiResponse<T>

/**
 * Pagination Meta (untuk response)
 */
export type PaginationMeta = {
  pagination: {
    page: number
    limit: number
    total_pages: number
    total_results: number
  }
}

/**
 * Pagination Request Query
 */
export type PaginationQuery = {
  page?: number
  limit?: number
}
