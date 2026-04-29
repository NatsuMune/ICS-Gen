import { describe, it, expect, vi } from "vitest";
import {
  buildAnthropicMessagesUrl,
  createAnthropicProvider,
} from "../../src/infrastructure/providers/anthropicProvider.js";

function createSettingsStoreStub(overrides = {}) {
  return {
    getCustomApiKey: () => "sk-ant-test",
    getCustomModel: () => "claude-test",
    getAnthropicBaseUrl: () => "",
    ...overrides,
  };
}

describe("anthropicProvider", () => {
  it("builds messages URLs from optional base URLs", () => {
    expect(buildAnthropicMessagesUrl("")).toBe(
      "https://api.anthropic.com/v1/messages"
    );
    expect(buildAnthropicMessagesUrl("https://hone.vvvv.ee/")).toBe(
      "https://hone.vvvv.ee/v1/messages"
    );
    expect(buildAnthropicMessagesUrl("https://api.example.com/v1")).toBe(
      "https://api.example.com/v1/messages"
    );
    expect(buildAnthropicMessagesUrl("https://api.example.com/v1/messages")).toBe(
      "https://api.example.com/v1/messages"
    );
  });

  it("throws when API key is missing", async () => {
    const provider = createAnthropicProvider({
      fetchImpl: vi.fn(),
      settingsStore: createSettingsStoreStub({ getCustomApiKey: () => "" }),
    });

    await expect(provider.parseItinerary({ text: "hi" })).rejects.toThrow(
      "Anthropic API key is not configured"
    );
  });

  it("sends Anthropic messages requests and parses events from text content", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify({ events: [{ summary: "Trip" }] }),
          },
        ],
      }),
    });

    const provider = createAnthropicProvider({
      fetchImpl,
      settingsStore: createSettingsStoreStub(),
      nowProvider: () => "now",
    });

    const events = await provider.parseItinerary({ text: "hi" });
    const [, request] = fetchImpl.mock.calls[0];
    const payload = JSON.parse(request.body);

    expect(events).toEqual([{ summary: "Trip" }]);
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://api.anthropic.com/v1/messages",
      expect.any(Object)
    );
    expect(request.headers).toMatchObject({
      "Content-Type": "application/json",
      "x-api-key": "sk-ant-test",
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    });
    expect(payload.model).toBe("claude-test");
    expect(payload.system).toContain("You MUST return a single JSON object");
    expect(payload.messages).toEqual([
      {
        role: "user",
        content: [{ type: "text", text: "hi" }],
      },
    ]);
  });

  it("sends image input as a base64 content block", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify({ events: [] }),
          },
        ],
      }),
    });

    const provider = createAnthropicProvider({
      fetchImpl,
      settingsStore: createSettingsStoreStub(),
    });

    await provider.parseItinerary({ imageBase64: "abc123" });

    const payload = JSON.parse(fetchImpl.mock.calls[0][1].body);
    expect(payload.messages[0].content).toEqual([
      {
        type: "image",
        source: {
          type: "base64",
          media_type: "image/jpeg",
          data: "abc123",
        },
      },
    ]);
  });

  it("uses a configured Anthropic-compatible base URL when provided", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify({ events: [] }),
          },
        ],
      }),
    });

    const provider = createAnthropicProvider({
      fetchImpl,
      settingsStore: createSettingsStoreStub({
        getAnthropicBaseUrl: () => "https://api.example.com/v1",
      }),
    });

    await provider.parseItinerary({ text: "hi" });

    expect(fetchImpl).toHaveBeenCalledWith(
      "https://api.example.com/v1/messages",
      expect.any(Object)
    );
  });
});
