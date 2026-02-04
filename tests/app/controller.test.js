import { describe, it, expect } from "vitest";
import { createAppController } from "../../src/app/controller.js";
import { createSettingsStore } from "../../src/infrastructure/settingsStore.js";
import { createMemoryStorage } from "../helpers/storage.js";

function setupDom() {
  document.body.innerHTML = `
    <textarea id="text-input"></textarea>
    <input id="image-upload-input" />
    <button id="generate-btn"></button>
    <button id="download-btn"></button>
    <div id="loader" class="hidden"></div>
    <div id="results-container" class="hidden"></div>
    <div id="download-container" class="hidden"></div>
    <div id="error-message" class="hidden"></div>
    <div id="drop-zone"></div>
    <div id="upload-prompt"></div>
    <div id="image-preview-container"></div>
    <img id="image-preview" />
    <div id="image-name"></div>
    <button id="remove-image-btn"></button>
    <div id="api-key-modal" class="hidden"></div>
    <input id="api-key-input" />
    <button id="save-api-key-btn"></button>
    <div id="api-key-error"></div>
    <button id="reset-btn"></button>
    <button id="settings-btn"></button>
    <div id="settings-modal" class="hidden"></div>
    <button id="close-settings-btn"></button>
    <select id="settings-provider-select"></select>
    <div id="provider-config-fields"></div>
    <div id="openrouter-config-fields"></div>
    <input id="settings-provider-endpoint-input" />
    <input id="settings-provider-api-key-input" />
    <input id="settings-provider-model-input" />
    <input id="settings-api-key-input" />
    <input id="settings-model-input" />
    <button id="save-settings-btn"></button>
    <button id="cancel-settings-btn"></button>
    <div id="settings-api-key-error"></div>
  `;

  return {
    textInput: document.getElementById("text-input"),
    imageUploadInput: document.getElementById("image-upload-input"),
    generateBtn: document.getElementById("generate-btn"),
    downloadBtn: document.getElementById("download-btn"),
    loader: document.getElementById("loader"),
    resultsContainer: document.getElementById("results-container"),
    downloadContainer: document.getElementById("download-container"),
    errorMessage: document.getElementById("error-message"),
    dropZone: document.getElementById("drop-zone"),
    uploadPrompt: document.getElementById("upload-prompt"),
    imagePreviewContainer: document.getElementById("image-preview-container"),
    imagePreview: document.getElementById("image-preview"),
    imageName: document.getElementById("image-name"),
    removeImageBtn: document.getElementById("remove-image-btn"),
    apiKeyModal: document.getElementById("api-key-modal"),
    apiKeyInput: document.getElementById("api-key-input"),
    saveApiKeyBtn: document.getElementById("save-api-key-btn"),
    apiKeyError: document.getElementById("api-key-error"),
    resetBtn: document.getElementById("reset-btn"),
    settingsBtn: document.getElementById("settings-btn"),
    settingsModal: document.getElementById("settings-modal"),
    closeSettingsBtn: document.getElementById("close-settings-btn"),
    settingsProviderSelect: document.getElementById("settings-provider-select"),
    providerConfigFields: document.getElementById("provider-config-fields"),
    openrouterConfigFields: document.getElementById("openrouter-config-fields"),
    settingsProviderEndpointInput: document.getElementById(
      "settings-provider-endpoint-input"
    ),
    settingsProviderApiKeyInput: document.getElementById(
      "settings-provider-api-key-input"
    ),
    settingsProviderModelInput: document.getElementById(
      "settings-provider-model-input"
    ),
    settingsApiKeyInput: document.getElementById("settings-api-key-input"),
    settingsModelInput: document.getElementById("settings-model-input"),
    saveSettingsBtn: document.getElementById("save-settings-btn"),
    cancelSettingsBtn: document.getElementById("cancel-settings-btn"),
    settingsApiKeyError: document.getElementById("settings-api-key-error"),
  };
}

describe("app controller", () => {
  it("renders results when parse succeeds", async () => {
    const dom = setupDom();
    const storage = createMemoryStorage({ openrouter_api_key: "sk-or-v1-test" });
    const settingsStore = createSettingsStore(storage);

    dom.textInput.value = "My trip";

    const providerFactory = () => ({
      parseItinerary: async () => [
        {
          summary: "Trip",
          dtstart: "2025-01-01T10:00:00",
          dtend: "2025-01-01T12:00:00",
          start_timezone: "America/New_York",
          end_timezone: "America/New_York",
          location: "NYC",
          description: "Hello",
        },
      ],
    });

    createAppController({
      dom,
      settingsStore,
      providerFactory,
      imageInputController: {
        getImageBase64: () => null,
        clearImage: () => {},
      },
      apiKeyModal: dom.apiKeyModal,
      settingsModal: dom.settingsModal,
    });

    dom.generateBtn.click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(dom.resultsContainer.classList.contains("hidden")).toBe(false);
    expect(dom.resultsContainer.innerHTML).toContain("Trip");
  });

  it("shows error when no input is provided", async () => {
    const dom = setupDom();
    const storage = createMemoryStorage({ openrouter_api_key: "sk-or-v1-test" });
    const settingsStore = createSettingsStore(storage);

    createAppController({
      dom,
      settingsStore,
      providerFactory: () => ({ parseItinerary: async () => [] }),
      imageInputController: {
        getImageBase64: () => null,
        clearImage: () => {},
      },
      apiKeyModal: dom.apiKeyModal,
      settingsModal: dom.settingsModal,
    });

    dom.generateBtn.click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(dom.errorMessage.classList.contains("hidden")).toBe(false);
  });
});
