import type { BaseApiResponse, SuccessApiResponse } from '../general/general'

/**
 * ========================================
 * DATA TYPES (Raw dari Database)
 * ========================================
 */

/**
 * Base User - dari database
 */
export type BaseUser = {
  id: string
  name: string | null
  email: string
  avatar: string | null
  bio: string | null
  email_verified: boolean
  created_at: string
  updated_at: string
}

/**
 * Public User Profile (user yang tampil ke public)
 */
export type PublicUser = {
  id: string
  name: string | null
  avatar: string | null
  bio: string | null
}

/**
 * User dengan update profile fields
 */
export type UserProfile = {
  id: string
  name: string | null
  email: string
  bio: string | null
  updated_at: string
}

/**
 * ========================================
 * REQUEST TYPES
 * ========================================
 */

export type AuthRegisterRequest = {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export type AuthLoginRequest = {
  email: string
  password: string
}

export type AuthUpdateProfileRequest = {
  name?: string
  bio?: string
}

/**
 * ========================================
 * RESPONSE TYPES
 * ========================================
 */

/**
 * Register/Login Response - user di-wrap dalam object
 */
export type AuthResponse = BaseApiResponse<{
  user: BaseUser
}>

/**
 * Get Current User Response - langsung BaseUser
 */
export type GetMeResponse = BaseApiResponse<BaseUser>

/**
 * Update Profile Response
 */
export type UpdateProfileResponse = BaseApiResponse<UserProfile>

/**
 * Logout Response
 */
export type LogoutResponse = BaseApiResponse<null>

/**
 * Refresh Token Response
 */
export type RefreshTokenResponse = BaseApiResponse<null>
