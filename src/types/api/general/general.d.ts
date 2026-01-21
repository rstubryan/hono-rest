/**
 * API Response Standard
 *
 * Semua response API menggunakan format yang sama:
 * - Selalu ada field `code`, `status`, `message`, `data`
 * - `status` bisa 'success' atau 'error'
 * - `meta` bersifat opsional, ada jika perlu (pagination, dsb)
 */

/**
 * Success Response Structure
 */
export type SuccessApiResponse<T = unknown> = {
  code: number
  status: 'success'
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
  code: number
  status: 'error'
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
