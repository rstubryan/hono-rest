import type { User as PrismaUser } from '@prisma/client'
import { BaseUser } from '@/types/api/auth/auth'

export type User = PrismaUser

export function toBaseUser(user: User): BaseUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    email_verified: user.email_verified,
    permissions: [],
    created_at: user.created_at.toISOString(),
    updated_at: user.updated_at.toISOString(),
  }
}
