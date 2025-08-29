import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default { 
  port: 3521, 
  fetch: app.fetch, 
} 