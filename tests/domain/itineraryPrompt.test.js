import { describe, it, expect } from "vitest";
import { buildItineraryPrompt } from "../../src/domain/itineraryPrompt.js";

describe("buildItineraryPrompt", () => {
  it("includes the provided timestamp", () => {
    const prompt = buildItineraryPrompt("2025-01-01T00:00:00.000Z");
    expect(prompt).toContain("2025-01-01T00:00:00.000Z");
  });
});
