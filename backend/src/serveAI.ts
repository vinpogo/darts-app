import { Context } from "hono";
import { BlankEnv, BlankInput } from "hono/types";
import {
  ScoringAverage,
  Field,
  FieldWithout0,
  PossibleCheckouts,
} from "../../shared/types";
import { getCheckoutTargets } from "../ai/ai.service";
import { db, getAims } from "./db";
import * as calculatedPossibilities from "../../shared/possibilities.json";

export async function serveAI(c: Context<BlankEnv, "/", BlankInput>) {
  const score = Number(c.req.query("score"));
  if (!score) {
    return c.json({
      error: "No score provided, please use queryParams '<url>?score=<number>'",
    });
  }

  const aims: ScoringAverage = getAims();
  const possibilities: Field[][] =
    (calculatedPossibilities as PossibleCheckouts)[score] ?? [];

  // AI is not available
  if (!Bun.env.AI_API_KEY) {
    return c.json({
      checkout: possibilities[score],
      explanation: "",
    });
  }

  const result = await getCheckoutTargets({
    score,
    possibilities,
    aims,
  });
  const { checkout, explanation } = result;
  return c.json({ checkout, explanation });
}
