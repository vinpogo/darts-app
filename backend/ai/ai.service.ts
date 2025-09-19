import OpenAI from "openai"
import type { Aims, PossibleCheckouts, Field } from "../../shared/types"
import type {
  ChatModel,
  Model,
  Reasoning,
  ReasoningEffort,
} from "openai/resources"
import z from "zod"
import { FieldSchema } from "./schema"
import { zodTextFormat } from "openai/helpers/zod"
import { systemPrompt } from "./system.prompt"

type OpenAIModelConfig = {
  model: ChatModel
  reasoning_effort?: ReasoningEffort
}

type OllamaModelConfig = {
  model: string
}

const config = {
  apiKey: Bun.env.AI_API_KEY,
  baseUrl: Bun.env.AI_BASE_URL,
}

/**
 * GPT 5-nano with low reasoning effort is reasonably fast,
 * and can solve all the problems.
 */
const gpt5: OpenAIModelConfig = {
  model: "gpt-5-nano",
  reasoning_effort: "low",
}

const ollama: OllamaModelConfig = {
  model: "qwen3:4b-instruct-2507-q4_K_M",
}

const client = new OpenAI({
  apiKey: config.apiKey,
  baseURL: config.baseUrl,
})

export const CheckoutSchema = z.object({
  checkout: z.array(FieldSchema),
  explanation: z.string(),
  // simple_explanation: z.string(),
})

interface CheckoutTargetsProp {
  aims: Aims
  possibilities: PossibleCheckouts
  score: number
}
export async function getCheckoutTargets(args: CheckoutTargetsProp): any {
  debugger
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
`

  const response = await client.chat.completions.create({
    ...(config.baseUrl ? ollama : gpt5),
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
  })

  const responseMessage = response.choices[0].message.content
  if (!responseMessage) {
    throw new Error("No response from AI")
  }

  const jsonText = responseMessage.slice(
    responseMessage.indexOf("{"),
    responseMessage.lastIndexOf("}") + 1
  )
  if (!jsonText) {
    throw new Error("No JSON from AI")
  }

  try {
    const result = CheckoutSchema.parse(JSON.parse(jsonText))
    return result
  } catch {
    throw new Error("Invalid JSON from AI: " + jsonText)
  }
}
