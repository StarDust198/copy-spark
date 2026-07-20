export const DEFAULT_MODEL = "anthropic/claude-haiku-4.5";

export const MODELS = [
  {
    id: "google/gemini-2.5-flash",
    label: "Gemini Flash",
    hint: "Cheapest, fast",
    provider: "google",
  },
  {
    id: "google/gemini-2.5-flash-lite",
    label: "Gemini Flash Lite",
    hint: "Cheaper, fast",
    provider: "google",
  },
  {
    id: "openai/gpt-5-mini",
    label: "GPT-5 Mini",
    hint: "Balanced",
    provider: "openai",
  },
  {
    id: "openai/gpt-5-nano",
    label: "GPT-5 Nano",
    hint: "Budget",
    provider: "openai",
  },
  {
    id: "anthropic/claude-haiku-4.5",
    label: "Claude Haiku",
    hint: "Best writing",
    provider: "anthropic",
  },
  {
    id: "mistral/mistral-small",
    label: "Mistral Small",
    hint: "Cheap, open",
    provider: "mistral",
  },
  {
    id: "amazon/nova-lite",
    label: "Nova Lite",
    hint: "Budget",
    provider: "amazon-bedrock",
  },
] as const;
