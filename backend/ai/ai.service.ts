import OpenAI from "openai";
import type {
  Field,
  PossibleCheckouts,
  ScoringAverage,
} from "../../shared/types";
import type { ChatModel, ReasoningEffort } from "openai/resources";
import z from "zod";
import { FieldSchema } from "./schema";
import { systemPrompt } from "./system.prompt";

type OpenAIModelConfig = {
  model: ChatModel;
  reasoning_effort?: ReasoningEffort;
};

type OllamaModelConfig = {
  model: string;
};

const config = {
  apiKey: Bun.env.AI_API_KEY,
  baseUrl: Bun.env.AI_BASE_URL,
};

/**
 * GPT 5-nano with low reasoning effort is reasonably fast,
 * and can solve all the problems.
 */
const gpt5: OpenAIModelConfig = {
  model: "gpt-5-nano",
  reasoning_effort: "low",
};

const ollama: OllamaModelConfig = {
  model: "qwen3:4b",
};

const client = new OpenAI({
  apiKey: config.apiKey,
  baseURL: config.baseUrl,
});

export const CheckoutSchema = z.object({
  checkout: z.array(FieldSchema),
  explanation: z.string(),
  // simple_explanation: z.string(),
});

interface CheckoutTargetsProp {
  aims: ScoringAverage;
  possibilities: Field[][];
  score: number;
}
export async function getCheckoutTargets(args: CheckoutTargetsProp): Promise<{
  checkout: Field[];
  explanation: string;
}> {
  debugger;
  const prompt = `
The player has a score of ${args.score}.

# Aims
Their aim history (accuracy data) looks like this:
${JSON.stringify(args.aims, null, 2)}


## Possible Checkouts
${Object.entries(args.possibilities)
  .map((c) => {
    return "- " + c[1].join(", ");
  })
  .join("\n")}

Return it in JSON strictly matching the schema.
`;

  const response = await client.chat.completions.create({
    ...(config.baseUrl ? ollama : gpt5),
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
  });

  const responseMessage = response.choices[0].message.content;
  if (!responseMessage) {
    throw new Error("No response from AI");
  }

  const jsonText = responseMessage.slice(
    responseMessage.indexOf("{"),
    responseMessage.lastIndexOf("}") + 1
  );
  if (!jsonText) {
    throw new Error("No JSON from AI");
  }

  try {
    // The AI sometimes returned the JSON in a wrong format with a trailing comma, so we implemented string parsing
    const filteredJson = jsonText.replace(/,\s*}/g, "}");
    const result = CheckoutSchema.parse(JSON.parse(filteredJson));
    return result;
  } catch {
    throw new Error("Invalid JSON from AI: " + jsonText);
  }
}
