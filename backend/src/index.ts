import { Hono } from "hono";
import { processShotList, DartShot } from "./dartProcessor";
import { serveAI } from './serveAI'
import { db } from './db'
const app = new Hono();

const query = db.query(`CREATE TABLE IF NOT EXISTS aims (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  json TEXT NOT NULL
);`);
query.run();

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
  idleTimeout: 30,
} 

db.close(false);