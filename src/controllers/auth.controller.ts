import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'
import { UserService } from '../services/users.service'
import { AuthRegisterRequest, AuthLoginRequest } from '../types/api/auth/auth'
import {
  COOKIE_NAMES,
  COOKIE_OPTIONS,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from '../utils/cookie'

export const authController = new Hono()

authController.post('/register', async (c) => {
  const request = (await c.req.json()) as AuthRegisterRequest

  const { user, tokens } = await UserService.register(request)

  setCookie(c, COOKIE_NAMES.ACCESS_TOKEN, tokens.accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  })

  setCookie(c, COOKIE_NAMES.REFRESH_TOKEN, tokens.refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  })

  return c.json(user)
})

authController.post('/login', async (c) => {
  const request = (await c.req.json()) as AuthLoginRequest

  const { user, tokens } = await UserService.login(request)

  setCookie(c, COOKIE_NAMES.ACCESS_TOKEN, tokens.accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  })

  setCookie(c, COOKIE_NAMES.REFRESH_TOKEN, tokens.refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  })

  return c.json(user)
})
