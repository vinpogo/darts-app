import OpenAI from "openai";
import type { Aims, PossibleCheckouts, Field } from "../../shared/types";
import type { ChatModel } from "openai/resources";
import z from "zod";
import { FieldSchema } from "./schema";
import { zodTextFormat } from "openai/helpers/zod";

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
});

interface CheckoutTargetsProp {
  aims: Aims;
  possibilities: PossibleCheckouts;
  score: number;
}
export async function getCheckoutTargets(
  args: CheckoutTargetsProp,
): Promise<Field[]> {
  const systemPrompt = `You are a darts assistant`;
  const prompt = `
The player has a score of ${args.score}.

Their aim history (accuracy data) looks like this:
${JSON.stringify(args.aims, null, 2)}
- Keys are the targets they aimed for.
- "darts" is how many times they aimed there.
- The other key-value pairs show probabilities of where the dart actually landed.


Task:
Pick the SINGLE most likely checkout sequence for the player.
Base your decision on both:
1. The checkout being mathematically valid.
2. The player's historical aim accuracy (i.e., prefer sequences that target fields they are more accurate at).
The possible checkout combinations are:
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

  return response.output_parsed?.checkout ?? [];
}
