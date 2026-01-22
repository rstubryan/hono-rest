import { sign } from 'hono/jwt'
import type { JWTPayload } from '@/types/api/general/general'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me'
const JWT_EXPIRES_IN = 15 * 60 // 15 minutes in seconds
const REFRESH_TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60 // 7 days in seconds

export async function generateAccessToken(payload: JWTPayload): Promise<string> {
  const now = Math.floor(Date.now() / 1000)

  return await sign(
    {
      ...payload,
      iat: now,
      exp: now + JWT_EXPIRES_IN,
    },
    JWT_SECRET
  )
}

export function generateRefreshToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function getRefreshTokenExpiry(): Date {
  return new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN * 1000)
}
