import { describe, it, expect, vi } from "vitest";
import { createOpenAICompatibleProvider } from "../../src/infrastructure/providers/openaiCompatibleProvider.js";

function createSettingsStoreStub(overrides = {}) {
  return {
    getCustomApiKey: () => "sk-test",
    getCustomModel: () => "test-model",
    getCustomEndpoint: () => "https://api.example.com/v1/chat/completions",
    ...overrides,
  };
}

describe("openaiCompatibleProvider", () => {
  it("throws when endpoint is missing", async () => {
    const provider = createOpenAICompatibleProvider({
      fetchImpl: vi.fn(),
      settingsStore: createSettingsStoreStub({ getCustomEndpoint: () => "" }),
    });

    await expect(provider.parseItinerary({ text: "hi" })).rejects.toThrow(
      "Provider endpoint is not configured"
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
    expect(fetchImpl).toHaveBeenCalledOnce();
  });
});
