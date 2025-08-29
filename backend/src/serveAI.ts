import { Context } from "hono";
import { BlankEnv, BlankInput } from "hono/types";
import { Field } from "../../shared/types";

export function serveAI(c: Context<BlankEnv, "/", BlankInput>) {
    const score = c.req.query('score')
    if (!score) {
        return c.json({ error: "No score provided, please use queryParams '<url>?score=<number>'" });
    }

    const possibilities: Field[][] = [['D20', 'T20', '20'], ['D19', 'T19', '19']];

    return c.json({ possibilities  });
}