import { Hono } from 'hono'
import { serveAI } from './serveAI'

const app = new Hono()

app.get('/', serveAI)

export default { 
  port: 3521, 
  fetch: app.fetch, 
} 