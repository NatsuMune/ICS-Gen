import { describe, it, expect } from "vitest";
import { createSettingsStore } from "../../src/infrastructure/settingsStore.js";
import { createMemoryStorage } from "../helpers/storage.js";

describe("settingsStore", () => {
  it("returns defaults when storage is empty", () => {
    const storage = createMemoryStorage();
    const store = createSettingsStore(storage);

    expect(store.getApiKey()).toBe("");
    expect(store.getModel()).toBe(store.defaults.model);
    expect(store.getProvider()).toBe(store.defaults.provider);
  });

  it("reads and writes provider-specific settings", () => {
    const storage = createMemoryStorage();
    const store = createSettingsStore(storage);

    store.setProvider("openai-compatible");
    store.setCustomEndpoint("https://api.example.com/v1/chat/completions");
    store.setCustomApiKey("sk-test");
    store.setCustomModel("test-model");

    expect(store.getProvider()).toBe("openai-compatible");
    expect(store.getCustomEndpoint()).toBe(
      "https://api.example.com/v1/chat/completions"
    );
    expect(store.getCustomApiKey()).toBe("sk-test");
    expect(store.getCustomModel()).toBe("test-model");
  });

  it("validates OpenRouter API keys", () => {
    const storage = createMemoryStorage();
    const store = createSettingsStore(storage);

    expect(store.isApiKeyValid("sk-or-v1-abc")).toBe(true);
    expect(store.isApiKeyValid("sk-abc")).toBe(false);
  });
});
