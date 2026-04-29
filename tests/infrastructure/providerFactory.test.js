import { describe, it, expect } from "vitest";
import { createProvider } from "../../src/infrastructure/providers/providerFactory.js";
import { createSettingsStore } from "../../src/infrastructure/settingsStore.js";
import { createMemoryStorage } from "../helpers/storage.js";

describe("providerFactory", () => {
  it("creates Anthropic providers", () => {
    const store = createSettingsStore(createMemoryStorage());
    const provider = createProvider({ name: "anthropic", settingsStore: store });

    expect(provider.name).toBe("anthropic");
  });

  it("throws for unknown provider", () => {
    const store = createSettingsStore(createMemoryStorage());
    expect(() =>
      createProvider({ name: "unknown", settingsStore: store })
    ).toThrow("Unknown provider");
  });
});
