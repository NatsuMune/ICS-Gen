import { describe, it, expect } from "vitest";
import { setupApiKeyModal } from "../../src/ui/apiKeyModal.js";
import { createSettingsStore } from "../../src/infrastructure/settingsStore.js";
import { createMemoryStorage } from "../helpers/storage.js";

function setupDom() {
  document.body.innerHTML = `
    <div id="api-key-modal" class="hidden"></div>
    <select id="api-provider-select">
      <option value="openrouter">OpenRouter</option>
      <option value="openai-compatible">OpenAI-Compatible</option>
      <option value="anthropic">Anthropic</option>
    </select>
    <div id="api-openrouter-config-fields"></div>
    <div id="api-provider-config-fields" class="hidden"></div>
    <div id="api-provider-endpoint-group"></div>
    <label for="api-provider-endpoint-input">Provider Base URL (optional)</label>
    <label for="api-provider-api-key-input">Provider API Key</label>
    <label for="api-provider-model-input">Provider Model</label>
    <input id="api-provider-endpoint-input" />
    <input id="api-provider-api-key-input" />
    <input id="api-provider-model-input" />
    <input id="api-key-input" />
    <input id="api-model-input" />
    <button id="save-api-key-btn"></button>
    <div id="api-key-error" class="hidden"></div>
    <input id="settings-api-key-input" />
    <input id="settings-model-input" />
    <select id="settings-provider-select">
      <option value="openrouter">OpenRouter</option>
      <option value="openai-compatible">OpenAI-Compatible</option>
      <option value="anthropic">Anthropic</option>
    </select>
    <input id="settings-provider-endpoint-input" />
    <input id="settings-provider-api-key-input" />
    <input id="settings-provider-model-input" />
  `;

  return {
    apiKeyModal: document.getElementById("api-key-modal"),
    apiProviderSelect: document.getElementById("api-provider-select"),
    apiOpenrouterConfigFields: document.getElementById(
      "api-openrouter-config-fields"
    ),
    apiProviderConfigFields: document.getElementById(
      "api-provider-config-fields"
    ),
    apiProviderEndpointGroup: document.getElementById(
      "api-provider-endpoint-group"
    ),
    apiProviderEndpointInput: document.getElementById(
      "api-provider-endpoint-input"
    ),
    apiProviderApiKeyInput: document.getElementById(
      "api-provider-api-key-input"
    ),
    apiProviderModelInput: document.getElementById("api-provider-model-input"),
    apiKeyInput: document.getElementById("api-key-input"),
    apiModelInput: document.getElementById("api-model-input"),
    saveApiKeyBtn: document.getElementById("save-api-key-btn"),
    apiKeyError: document.getElementById("api-key-error"),
    settingsApiKeyInput: document.getElementById("settings-api-key-input"),
    settingsModelInput: document.getElementById("settings-model-input"),
    settingsProviderSelect: document.getElementById("settings-provider-select"),
    settingsProviderEndpointInput: document.getElementById(
      "settings-provider-endpoint-input"
    ),
    settingsProviderApiKeyInput: document.getElementById(
      "settings-provider-api-key-input"
    ),
    settingsProviderModelInput: document.getElementById(
      "settings-provider-model-input"
    ),
  };
}

function setupModal(store) {
  const dom = setupDom();
  setupApiKeyModal({
    ...dom,
    settingsStore: store,
  });
  return dom;
}

describe("apiKeyModal", () => {
  it("lets first-time users select and save an OpenAI-compatible provider", () => {
    const store = createSettingsStore(createMemoryStorage());
    const dom = setupModal(store);

    expect(dom.apiKeyModal.classList.contains("hidden")).toBe(false);

    dom.apiProviderSelect.value = "openai-compatible";
    dom.apiProviderSelect.dispatchEvent(new Event("change"));

    expect(dom.apiProviderConfigFields.classList.contains("hidden")).toBe(false);
    expect(dom.apiOpenrouterConfigFields.classList.contains("hidden")).toBe(true);

    dom.apiProviderEndpointInput.value = "https://api.example.com/v1";
    dom.apiProviderApiKeyInput.value = "sk-test";
    dom.apiProviderModelInput.value = "test-model";
    dom.saveApiKeyBtn.click();

    expect(store.getProvider()).toBe("openai-compatible");
    expect(store.getCustomBaseUrl()).toBe("https://api.example.com/v1");
    expect(store.getCustomApiKey()).toBe("sk-test");
    expect(store.getCustomModel()).toBe("test-model");
    expect(dom.apiKeyModal.classList.contains("hidden")).toBe(true);
  });

  it("does not force OpenRouter when another provider is already configured", () => {
    const storage = createMemoryStorage({
      ai_provider: "anthropic",
      provider_api_key: "sk-ant-test",
      provider_model: "claude-test",
    });
    const store = createSettingsStore(storage);
    const dom = setupModal(store);

    expect(dom.apiProviderSelect.value).toBe("anthropic");
    expect(dom.apiKeyModal.classList.contains("hidden")).toBe(true);
  });

  it("validates required custom provider credentials", () => {
    const store = createSettingsStore(createMemoryStorage());
    const dom = setupModal(store);

    dom.apiProviderSelect.value = "anthropic";
    dom.apiProviderSelect.dispatchEvent(new Event("change"));
    dom.saveApiKeyBtn.click();

    expect(dom.apiKeyError.classList.contains("hidden")).toBe(false);
    expect(dom.apiProviderApiKeyInput.classList.contains("field-error-state")).toBe(
      true
    );
    expect(dom.apiProviderModelInput.classList.contains("field-error-state")).toBe(
      true
    );
    expect(store.getProvider()).toBe("openrouter");
  });
});
