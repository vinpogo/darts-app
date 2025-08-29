import { Hono } from "hono";
import { processShotList, DartShot } from "./dartProcessor";
import { serveAI } from './serveAI'
import { db } from './db'
const app = new Hono();



app.get('/', serveAI)

app.post("/processor", async (c) => {
  const shots: DartShot[] = await c.req.json();
  processShotList(shots);
  return c.body("Dart Shots processed", 201, {
    "Content-Type": "text/plain",
  });
});

export default { 
  port: 3521, 
  fetch: app.fetch, 
} 

db.close(false);