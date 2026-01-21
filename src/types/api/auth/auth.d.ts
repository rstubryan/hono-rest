import type { BaseApiResponse } from '../general/general'

/**
 * ========================================
 * DATA TYPES (Raw dari Database)
 * ========================================
 */

/**
 * Base User - atomic fields dari database
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
  permissions: string[]
}

/**
 * User - full data dengan permissions
 */
export type User = BaseUser

/**
 * Public User - user data yang tampil ke public (tanpa sensitive info)
 * Menggunakan Pick dari BaseUser
 */
export type PublicUser = Pick<BaseUser, 'id' | 'name' | 'avatar' | 'bio'>

/**
 * User Profile - partial data untuk update profile response
 * Menggunakan Pick dari BaseUser
 */
export type UserProfile = Pick<BaseUser, 'id' | 'name' | 'email' | 'bio' | 'updated_at'>

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
 * Register/Login Response
 */
export type AuthResponse = BaseApiResponse<{
  user: BaseUser
}>

/**
 * GetMe - Get current user dengan permissions
 */
export type GetMe = BaseApiResponse<User>

/**
 * UpdateProfileResponse - Update profile result
 */
export type UpdateProfileResponse = BaseApiResponse<UserProfile>

/**
 * LogoutResponse - Logout result
 */
export type LogoutResponse = BaseApiResponse<null>

/**
 * RefreshTokenResponse - Refresh token result
 */
export type RefreshTokenResponse = BaseApiResponse<null>
