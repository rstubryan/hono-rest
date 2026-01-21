import type { BaseApiResponse, Timestamps } from '../general/general'

// ================================
// DATA TYPES
// ================================

export type BaseUser = {
  id: string
  name: string | null
  email: string
  avatar: string | null
  bio: string | null
  email_verified: boolean
  permissions: string[]
} & Timestamps

export type PublicUser = Pick<BaseUser, 'id' | 'name' | 'avatar' | 'bio'>

export type UserProfile = Pick<BaseUser, 'id' | 'name' | 'email' | 'bio' | 'updated_at'>

export type User = BaseApiResponse<BaseUser>

// ================================
// REQUEST
// ================================

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

// ================================
// RESPONSE
// ================================

export type AuthResponse = BaseApiResponse<{
  user: BaseUser
}>

export type UpdateProfileResponse = BaseApiResponse<UserProfile>

export type LogoutResponse = BaseApiResponse<null>

export type RefreshTokenResponse = BaseApiResponse<null>
