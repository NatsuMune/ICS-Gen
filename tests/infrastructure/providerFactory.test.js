import { describe, it, expect } from "vitest";
import { createProvider } from "../../src/infrastructure/providers/providerFactory.js";
import { createSettingsStore } from "../../src/infrastructure/settingsStore.js";
import { createMemoryStorage } from "../helpers/storage.js";

describe("providerFactory", () => {
  it("throws for unknown provider", () => {
    const store = createSettingsStore(createMemoryStorage());
    expect(() =>
      createProvider({ name: "unknown", settingsStore: store })
    ).toThrow("Unknown provider");
  });
});
