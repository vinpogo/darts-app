# Setup Guide for Ollama Integration

## 1. Install Ollama
Download and install Ollama on your local computer from:  
👉 [https://ollama.com/download](https://ollama.com/download)

---

## 2. Install the Correct Model
Pull the model you want to use with Ollama:

```bash
ollama pull [MODEL NAME]
```

### 2.1 Find Available Models
Check the list of available models here:  
👉 [https://ollama.com/search?o=newest](https://ollama.com/search?o=newest)

The default code is configured to use **qwen3:4b**.

### 2.2 Using Another Model
If you decide to use a different model, update the `model` field inside `ai.service.ts`:

```ts
const ollama: OllamaModelConfig = {
  model: "gemma3:270m",
};
```

---

## 3. Configure Environment Variables
Ensure your `.env` file has the correct format:

```text
AI_API_KEY=ollama
AI_BASE_URL=http://localhost:11434/v1
```

---