import { describe, it, expect, vi } from "vitest";
import {
  buildChatCompletionsUrl,
  createOpenAICompatibleProvider,
} from "../../src/infrastructure/providers/openaiCompatibleProvider.js";

function createSettingsStoreStub(overrides = {}) {
  return {
    getCustomApiKey: () => "sk-test",
    getCustomModel: () => "test-model",
    getCustomBaseUrl: () => "https://api.example.com/v1",
    ...overrides,
  };
}

describe("openaiCompatibleProvider", () => {
  it("builds chat completions URLs from provider base URLs", () => {
    expect(buildChatCompletionsUrl("https://api.example.com/v1")).toBe(
      "https://api.example.com/v1/chat/completions"
    );
    expect(buildChatCompletionsUrl("https://api.example.com/v1/")).toBe(
      "https://api.example.com/v1/chat/completions"
    );
    expect(
      buildChatCompletionsUrl("https://api.example.com/v1/chat/completions")
    ).toBe("https://api.example.com/v1/chat/completions");
  });

  it("throws when base URL is missing", async () => {
    const provider = createOpenAICompatibleProvider({
      fetchImpl: vi.fn(),
      settingsStore: createSettingsStoreStub({ getCustomBaseUrl: () => "" }),
    });

    await expect(provider.parseItinerary({ text: "hi" })).rejects.toThrow(
      "Provider base URL is not configured"
    );
  });

  it("parses events from response", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({ events: [{ summary: "Trip" }] }),
            },
          },
        ],
      }),
    });

    const provider = createOpenAICompatibleProvider({
      fetchImpl,
      settingsStore: createSettingsStoreStub(),
      nowProvider: () => "now",
    });

    const events = await provider.parseItinerary({ text: "hi" });

    expect(events).toEqual([{ summary: "Trip" }]);
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://api.example.com/v1/chat/completions",
      expect.any(Object)
    );
  });
});
