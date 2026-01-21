import { UserValidation } from '../schema/users.schema'
import { AuthRegisterRequest, AuthLoginRequest, AuthResponse } from '../types/api/auth/auth'
import { toBaseUser } from '../models/users'
import prisma from '../client/prisma'
import { HTTPException } from 'hono/http-exception'

export class UserService {
  static async register(request: AuthRegisterRequest): Promise<AuthResponse> {
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

    return {
      code: 201,
      status: 'created',
      message: 'User registered successfully',
      data: {
        user: toBaseUser(user),
      },
    }
  }

  static async login(request: AuthLoginRequest): Promise<AuthResponse> {
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

    // TODO: generate JWT/refresh token

    return {
      code: 200,
      status: 'success',
      message: 'Login successful',
      data: {
        user: toBaseUser(user),
      },
    }
  }
}
