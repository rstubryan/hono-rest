import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default {
  port: process.env.APP_PORT ?? 8000,
  fetch: app.fetch,
}
