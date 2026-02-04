import { describe, it, expect } from "vitest";
import { setupSettingsModal } from "../../src/ui/settingsModal.js";
import { createSettingsStore } from "../../src/infrastructure/settingsStore.js";
import { createMemoryStorage } from "../helpers/storage.js";

describe("settingsModal", () => {
  it("toggles provider fields and saves custom settings", () => {
    document.body.innerHTML = `
      <button id="settings-btn"></button>
      <div id="settings-modal" class="hidden"></div>
      <button id="close-settings-btn"></button>
      <select id="settings-provider-select">
        <option value="openrouter">OpenRouter</option>
        <option value="openai-compatible">OpenAI-Compatible</option>
      </select>
      <div id="provider-config-fields" class="hidden"></div>
      <div id="openrouter-config-fields"></div>
      <input id="settings-provider-endpoint-input" />
      <input id="settings-provider-api-key-input" />
      <input id="settings-provider-model-input" />
      <input id="settings-api-key-input" />
      <input id="settings-model-input" />
      <button id="save-settings-btn"></button>
      <button id="cancel-settings-btn"></button>
      <div id="settings-api-key-error" class="hidden"></div>
    `;

    const store = createSettingsStore(createMemoryStorage());

    const settingsProviderSelect = document.getElementById(
      "settings-provider-select"
    );
    const providerConfigFields = document.getElementById(
      "provider-config-fields"
    );
    const openrouterConfigFields = document.getElementById(
      "openrouter-config-fields"
    );
    const settingsProviderEndpointInput = document.getElementById(
      "settings-provider-endpoint-input"
    );
    const settingsProviderApiKeyInput = document.getElementById(
      "settings-provider-api-key-input"
    );
    const settingsProviderModelInput = document.getElementById(
      "settings-provider-model-input"
    );

    setupSettingsModal({
      settingsBtn: document.getElementById("settings-btn"),
      settingsModal: document.getElementById("settings-modal"),
      closeSettingsBtn: document.getElementById("close-settings-btn"),
      settingsProviderSelect,
      providerConfigFields,
      openrouterConfigFields,
      settingsProviderEndpointInput,
      settingsProviderApiKeyInput,
      settingsProviderModelInput,
      settingsApiKeyInput: document.getElementById("settings-api-key-input"),
      settingsModelInput: document.getElementById("settings-model-input"),
      saveSettingsBtn: document.getElementById("save-settings-btn"),
      cancelSettingsBtn: document.getElementById("cancel-settings-btn"),
      settingsApiKeyError: document.getElementById("settings-api-key-error"),
      settingsStore: store,
    });

    settingsProviderSelect.value = "openai-compatible";
    settingsProviderSelect.dispatchEvent(new Event("change"));

    expect(providerConfigFields.classList.contains("hidden")).toBe(false);
    expect(openrouterConfigFields.classList.contains("hidden")).toBe(true);

    settingsProviderEndpointInput.value = "https://api.example.com";
    settingsProviderApiKeyInput.value = "sk-test";
    settingsProviderModelInput.value = "test-model";

    document.getElementById("save-settings-btn").click();

    expect(store.getProvider()).toBe("openai-compatible");
    expect(store.getCustomEndpoint()).toBe("https://api.example.com");
    expect(store.getCustomApiKey()).toBe("sk-test");
    expect(store.getCustomModel()).toBe("test-model");
  });
});
