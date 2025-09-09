# Darts counter with AI suggestions
The darts counter is a simple app to count the score of a darts game.

## AI suggestions
The counter tracks your accuracy on the shots you did.
Based on the accuracy and possible checkouts,
it provides AI suggestions on what to throw next, that you can actually hit.

### Setup AI
Add a .env file inside the backend folder.

For a setup with OpenAI, the .env file should look like this:
```
AI_API_KEY=your-api-key
```

You can also use it with ollama. The .env file in that case will look like this:
```
AI_API_KEY=ollama
AI_BASE_URL=http://localhost:11434/v1
```

### Models to use
We tested different models and compared accuracy, performance and cost.
Here is a table of all the models we can recommend:

| Model | Accuracy | Performance | Cost | Response Time | Setup |
| --- | --- | --- | --- | --- | --- |
| `gpt-4.1-mini` | **** | **** | *** | 1-3 sec | OpenAI |
| `gpt-5-nano` (with low reasoning) | **** | *** | * | 5-15 sec | OpenAI |
| `qwen3:4b-instruct-2507-q4_K_M` | *** | ** | - | 5-25 sec | Ollama with A1000 6GB Mobile GPU |

For the OpenAI setup we default to `gpt-5-nano` with low reasoning effort.<br />
For the ollama setup we use `qwen3:4b-instruct-2507-q4_K_M`.

### Structured Output
Since ollama does not support structured output like OpenAI,
we went with the approach on doing everything as chat completion
and try our best to parse the JSON output. This works 99% of the time.