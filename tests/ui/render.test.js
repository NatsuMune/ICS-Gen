import { describe, it, expect } from "vitest";
import { renderResults, showError, hideError, setLoading } from "../../src/ui/render.js";

describe("render", () => {
  it("renders results and toggles visibility", () => {
    document.body.innerHTML = `
      <div id="results" class="hidden"></div>
      <div id="download" class="hidden"></div>
    `;

    const resultsContainer = document.getElementById("results");
    const downloadContainer = document.getElementById("download");

    const rendered = renderResults(
      { resultsContainer, downloadContainer },
      [
        {
          summary: "Trip",
          dtstart: "2025-01-01T10:00:00",
          dtend: "2025-01-01T12:00:00",
          start_timezone: "America/New_York",
          end_timezone: "America/New_York",
          location: "NYC",
          description: "Hello",
        },
      ]
    );

    expect(rendered).toBe(true);
    expect(resultsContainer.classList.contains("hidden")).toBe(false);
    expect(downloadContainer.classList.contains("hidden")).toBe(false);
    expect(resultsContainer.innerHTML).toContain("Trip");
  });

  it("returns false and hides containers for empty data", () => {
    document.body.innerHTML = `
      <div id="results"></div>
      <div id="download"></div>
    `;

    const resultsContainer = document.getElementById("results");
    const downloadContainer = document.getElementById("download");

    const rendered = renderResults(
      { resultsContainer, downloadContainer },
      []
    );

    expect(rendered).toBe(false);
    expect(resultsContainer.classList.contains("hidden")).toBe(true);
    expect(downloadContainer.classList.contains("hidden")).toBe(true);
  });

  it("toggles error and loading states", () => {
    document.body.innerHTML = `
      <div id="error" class="hidden"></div>
      <div id="loader" class="hidden"></div>
      <button id="generate"></button>
    `;

    const errorMessage = document.getElementById("error");
    const loader = document.getElementById("loader");
    const generateBtn = document.getElementById("generate");

    showError(errorMessage, "Oops");
    expect(errorMessage.classList.contains("hidden")).toBe(false);

    hideError(errorMessage);
    expect(errorMessage.classList.contains("hidden")).toBe(true);

    setLoading({ loader, generateBtn }, true);
    expect(loader.classList.contains("hidden")).toBe(false);
    expect(generateBtn.disabled).toBe(true);

    setLoading({ loader, generateBtn }, false);
    expect(loader.classList.contains("hidden")).toBe(true);
    expect(generateBtn.disabled).toBe(false);
  });
});
