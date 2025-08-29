import OpenAI from "openai";
import type { Aims, PossibleCheckouts, Field } from "../../shared/types";
import type { ChatModel } from "openai/resources";
import z from "zod";
import { FieldSchema } from "./schema";
import { zodTextFormat } from "openai/helpers/zod";
import { systemPrompt } from "./system.prompt";

const config = {
  apiKey: Bun.env.AI_API_KEY,
  baseUrl: Bun.env.AI_BASE_URL,
};
const model: ChatModel = "gpt-5-mini";
// const model: ChatModel = "gpt-4o-2024-08-06";

const client = new OpenAI({
  apiKey: config.apiKey,
  baseURL: config.baseUrl,
});

const CheckoutSchema = z.object({
  checkout: z.array(FieldSchema),
  explaination: z.string(),
  simple_explaination: z.string(),
});

interface CheckoutTargetsProp {
  aims: Aims;
  possibilities: PossibleCheckouts;
  score: number;
}
export async function getCheckoutTargets(args: CheckoutTargetsProp): any {
  const prompt = `
The player has a score of ${args.score}.

# Aims
Their aim history (accuracy data) looks like this:
${JSON.stringify(args.aims, null, 2)}


## Possible Checkouts
${Object.entries(args.possibilities)
  .map((c) => "- " + c[1].join(", "))
  .join("\n")}

Return it in JSON strictly matching the schema.
`;

  const response = await client.responses.parse({
    model,
    input: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    text: {
      format: zodTextFormat(CheckoutSchema, "checkout"),
    },
  });

  return response.output_parsed;
}
