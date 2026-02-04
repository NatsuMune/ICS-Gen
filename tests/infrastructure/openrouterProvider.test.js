import { describe, it, expect, vi } from "vitest";
import { createOpenRouterProvider } from "../../src/infrastructure/providers/openrouterProvider.js";

function createSettingsStoreStub() {
  return {
    getApiKey: () => "sk-or-v1-test",
    getModel: () => "test-model",
    clearApiKey: vi.fn(),
  };
}

describe("openrouterProvider", () => {
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

    const provider = createOpenRouterProvider({
      fetchImpl,
      settingsStore: createSettingsStoreStub(),
      nowProvider: () => "now",
    });

    const events = await provider.parseItinerary({ text: "hi" });

    expect(events).toEqual([{ summary: "Trip" }]);
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it("clears API key on 401", async () => {
    const settingsStore = createSettingsStoreStub();
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => "Unauthorized",
    });

    const provider = createOpenRouterProvider({
      fetchImpl,
      settingsStore,
      nowProvider: () => "now",
    });

    await expect(provider.parseItinerary({ text: "hi" })).rejects.toThrow(
      "Authentication failed"
    );
    expect(settingsStore.clearApiKey).toHaveBeenCalledOnce();
  });
});
