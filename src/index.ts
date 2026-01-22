import { Hono } from 'hono'
import { authController } from '@/controllers/auth.controller'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/', authController)

export default {
  port: process.env.APP_PORT ?? 8000,
  fetch: app.fetch,
}
