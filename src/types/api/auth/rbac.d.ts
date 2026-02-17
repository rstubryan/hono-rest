import type { BaseApiResponse, Timestamps, Assignable } from '@/types/api/general/general'

// ================================
// DATA TYPES
// ================================

export type BaseRole = {
  id: string
  name: string
  display_name: string
  description: string | null
  level: number
  permissions:
    | string[]
    | [
        {
          id: string
          name: string
          description: string | null
          resource: string
          action: string
        },
      ]
} & Timestamps

export type Role = BaseApiResponse<BaseRole>

// ================================
// REQUEST
// ================================

export type AuthRoleRequest = {
  role_id: string
  reason?: string
}

// ================================
// RESPONSE
// ================================

export type AuthRbacResponse = BaseApiResponse<
  {
    user_id: string
    roles: Pick<BaseRole, 'id' | 'name' | 'display_name'>[]
    previous_roles: Pick<BaseRole, 'id' | 'name'>[]
  } & Assignable
>
