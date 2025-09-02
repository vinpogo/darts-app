import OpenAI from "openai";
import type { Aims, PossibleCheckouts, Field } from "../../shared/types";
import type { ChatModel, Reasoning } from "openai/resources";
import z from "zod";
import { FieldSchema } from "./schema";
import { zodTextFormat } from "openai/helpers/zod";
import { systemPrompt } from "./system.prompt";

type ModelConfig = {
  model: ChatModel
  reasoning?: Reasoning
}

const config = {
  apiKey: Bun.env.AI_API_KEY,
  baseUrl: Bun.env.AI_BASE_URL,
};

/**
 * GPT 4.1-mini is very fast and can solve most of the problems.
 */
const gpt4: ModelConfig = {
  model: "gpt-4.1-mini"
};

/**
 * GPT 5-nano with low reasoning effort is reasonably fast,
 * and can solve all the problems.
 */
const gpt5: ModelConfig = {
  model: "gpt-5-nano",
  reasoning: {
    effort: 'low',
  },
}

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
  console.log("getCheckoutTargets", args);

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
    ...gpt5,
    input: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    text: {
      format: zodTextFormat(CheckoutSchema, "checkout"),
    },
  });

  console.log(response.usage)

  return response.output_parsed;
}
