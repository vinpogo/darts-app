import { Context } from "hono";
import { BlankEnv, BlankInput } from "hono/types";
import { Aims, Field } from "../../shared/types";
import { getCheckoutTargets } from "../ai/ai.service";
import { db } from "./db";

export function serveAI(c: Context<BlankEnv, "/", BlankInput>) {
  const score = Number(c.req.query("score"));
  if (!score) {
    return c.json({
      error: "No score provided, please use queryParams '<url>?score=<number>'",
    });
  }

  //    const query = db.query<Aims>('SELECT * FROM aims');
  const aims: Aims = {
    20: { 20: 100, shots: 100 },
    10: { shots: 40, 5: 20, 10: 10, 1: 10 },
  }; // query.get()
  const possibilities: Field[][] = [
    ["D20", "T20", "20"],
    ["D19", "T19", "19"],
  ];

  getCheckoutTargets({ score, possibilities, aims });

  return c.json({ possibilities });
}
