import { UserValidation } from '@/schema/users.schema'
import { AuthRegisterRequest, AuthLoginRequest, AuthResponse } from '@/types/api/auth/auth'
import { toBaseUser } from '@/models/users.model'
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry } from '@/utils/jwt'
import prisma from '@/client/prisma'
import { HTTPException } from 'hono/http-exception'

export class UserService {
  static async register(request: AuthRegisterRequest): Promise<{
    user: AuthResponse
    tokens: { accessToken: string; refreshToken: string }
  }> {
    const validated = UserValidation.REGISTER.parse(request)

    const existingUser = await prisma.user.count({
      where: {
        email: validated.email,
      },
    })

    if (existingUser !== 0) {
      throw new HTTPException(400, {
        message: 'Email already exists',
      })
    }

    const passwordHash = await Bun.password.hash(validated.password, {
      algorithm: 'bcrypt',
      cost: 10,
    })

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password_hash: passwordHash,
      },
    })

    const accessToken = await generateAccessToken({
      sub: user.id,
      email: user.email,
    })

    const refreshToken = generateRefreshToken()
    const refreshTokenExpiry = getRefreshTokenExpiry()

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: refreshTokenExpiry,
      },
    })

    return {
      user: {
        code: 201,
        status: 'created',
        message: 'User registered successfully',
        data: {
          user: toBaseUser(user),
        },
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    }
  }

  static async login(request: AuthLoginRequest): Promise<{
    user: AuthResponse
    tokens: { accessToken: string; refreshToken: string }
  }> {
    const validated = UserValidation.LOGIN.parse(request)

    const user = await prisma.user.findUnique({
      where: {
        email: validated.email,
      },
    })

    if (!user) {
      throw new HTTPException(401, {
        message: 'Email or password is wrong',
      })
    }

    const isPasswordValid = await Bun.password.verify(
      validated.password,
      user.password_hash,
      'bcrypt'
    )

    if (!isPasswordValid) {
      throw new HTTPException(401, {
        message: 'Email or password is wrong',
      })
    }

    const accessToken = await generateAccessToken({
      sub: user.id,
      email: user.email,
    })

    const refreshToken = generateRefreshToken()
    const refreshTokenExpiry = getRefreshTokenExpiry()

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: refreshTokenExpiry,
      },
    })

    return {
      user: {
        code: 200,
        status: 'success',
        message: 'Login successful',
        data: {
          user: toBaseUser(user),
        },
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    }
  }
}
