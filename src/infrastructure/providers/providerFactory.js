import { createOpenRouterProvider } from "./openrouterProvider.js";
import { createOpenAICompatibleProvider } from "./openaiCompatibleProvider.js";

export function createProvider({
  name = "openrouter",
  settingsStore,
  fetchImpl,
  nowProvider,
} = {}) {
  switch (name) {
    case "openrouter":
      return createOpenRouterProvider({ fetchImpl, settingsStore, nowProvider });
    case "openai-compatible":
      return createOpenAICompatibleProvider({
        fetchImpl,
        settingsStore,
        nowProvider,
      });
    default:
      throw new Error(`Unknown provider: ${name}`);
  }
}
