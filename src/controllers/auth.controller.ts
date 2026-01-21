import { Hono } from 'hono'
import { UserService } from '../services/users'
import { AuthRegisterRequest, AuthLoginRequest } from '../types/api/auth/auth'

export const authController = new Hono()

authController.post('/register', async (c) => {
  const request = (await c.req.json()) as AuthRegisterRequest

  const response = await UserService.register(request)

  return c.json(response)
})

authController.post('/login', async (c) => {
  const request = (await c.req.json()) as AuthLoginRequest

  const response = await UserService.login(request)

  return c.json(response)
})
