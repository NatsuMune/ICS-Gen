export function setupSettingsModal({
  settingsBtn,
  settingsModal,
  closeSettingsBtn,
  settingsProviderSelect,
  providerConfigFields,
  providerEndpointGroup,
  openrouterConfigFields,
  settingsProviderEndpointInput,
  settingsProviderApiKeyInput,
  settingsProviderModelInput,
  settingsApiKeyInput,
  settingsModelInput,
  saveSettingsBtn,
  cancelSettingsBtn,
  settingsApiKeyError,
  settingsStore,
}) {
  const setLabelText = (forAttribute, text) => {
    const label = document.querySelector(`label[for="${forAttribute}"]`);
    if (label) label.textContent = text;
  };

  const providerCopy = {
    "openai-compatible": {
      showEndpoint: true,
      endpointLabel: "Provider Base URL (optional)",
      endpointPlaceholder: "https://api.openai.com/v1",
      apiKeyLabel: "Provider API Key",
      apiKeyPlaceholder: "sk-...",
      modelLabel: "Provider Model",
      modelPlaceholder: "gpt-4o-mini",
    },
    anthropic: {
      showEndpoint: true,
      endpointLabel: "Anthropic Base URL (optional)",
      endpointPlaceholder: "https://api.anthropic.com/v1",
      apiKeyLabel: "Anthropic API Key",
      apiKeyPlaceholder: "sk-ant-...",
      modelLabel: "Anthropic Model",
      modelPlaceholder: "claude-sonnet-4-5",
    },
  };

  const getEndpointValueForProvider = (provider) => {
    if (provider === "anthropic") {
      return settingsStore.getAnthropicBaseUrl?.() || "";
    }
    return settingsStore.getCustomBaseUrl();
  };

  const toggleProviderFields = () => {
    const provider = settingsProviderSelect.value;
    if (provider === "openai-compatible" || provider === "anthropic") {
      const copy = providerCopy[provider];
      providerConfigFields.classList.remove("hidden");
      providerEndpointGroup?.classList.toggle("hidden", !copy.showEndpoint);
      settingsProviderEndpointInput.placeholder = copy.endpointPlaceholder;
      settingsProviderApiKeyInput.placeholder = copy.apiKeyPlaceholder;
      settingsProviderModelInput.placeholder = copy.modelPlaceholder;
      setLabelText("settings-provider-endpoint-input", copy.endpointLabel);
      setLabelText("settings-provider-api-key-input", copy.apiKeyLabel);
      setLabelText("settings-provider-model-input", copy.modelLabel);
      openrouterConfigFields.classList.add("hidden");
    } else {
      providerConfigFields.classList.add("hidden");
      providerEndpointGroup?.classList.remove("hidden");
      openrouterConfigFields.classList.remove("hidden");
    }
  };

  const hydrate = () => {
    settingsProviderSelect.value = settingsStore.getProvider();
    settingsApiKeyInput.value = settingsStore.getApiKey();
    settingsModelInput.value = settingsStore.getModel();
    settingsProviderEndpointInput.value = getEndpointValueForProvider(
      settingsProviderSelect.value
    );
    settingsProviderApiKeyInput.value = settingsStore.getCustomApiKey();
    settingsProviderModelInput.value = settingsStore.getCustomModel();
    toggleProviderFields();
  };

  settingsBtn.addEventListener("click", () => {
    hydrate();
    settingsModal.classList.remove("hidden");
  });

  closeSettingsBtn.addEventListener("click", () => {
    settingsModal.classList.add("hidden");
    settingsApiKeyError.classList.add("hidden");
    settingsApiKeyInput.classList.remove("field-error-state");
  });

  cancelSettingsBtn.addEventListener("click", () => {
    settingsModal.classList.add("hidden");
    settingsApiKeyError.classList.add("hidden");
    settingsApiKeyInput.classList.remove("field-error-state");
  });

  settingsProviderSelect.addEventListener("change", () => {
    settingsProviderEndpointInput.value = getEndpointValueForProvider(
      settingsProviderSelect.value
    );
    toggleProviderFields();
  });

  saveSettingsBtn.addEventListener("click", () => {
    const apiKey = settingsApiKeyInput.value.trim();
    const model = settingsModelInput.value.trim();
    const providerBaseUrl = settingsProviderEndpointInput.value.trim();
    const providerApiKey = settingsProviderApiKeyInput.value.trim();
    const providerModel = settingsProviderModelInput.value.trim();

    if (apiKey && !settingsStore.isApiKeyValid(apiKey)) {
      settingsApiKeyError.classList.remove("hidden");
      settingsApiKeyInput.classList.add("field-error-state");
      return;
    }

    if (apiKey) {
      settingsStore.setApiKey(apiKey);
    } else {
      settingsStore.clearApiKey();
    }

    if (settingsProviderSelect.value) {
      settingsStore.setProvider(settingsProviderSelect.value);
    }

    if (settingsProviderSelect.value === "anthropic") {
      if (providerBaseUrl) {
        settingsStore.setAnthropicBaseUrl?.(providerBaseUrl);
      } else {
        settingsStore.clearAnthropicBaseUrl?.();
      }
    } else if (providerBaseUrl) {
      settingsStore.setCustomBaseUrl(providerBaseUrl);
    } else {
      settingsStore.clearCustomBaseUrl();
    }

    if (providerApiKey) {
      settingsStore.setCustomApiKey(providerApiKey);
    } else {
      settingsStore.clearCustomApiKey();
    }

    if (providerModel) {
      settingsStore.setCustomModel(providerModel);
    } else {
      settingsStore.clearCustomModel();
    }

    if (model) {
      settingsStore.setModel(model);
    } else {
      settingsStore.setModel(settingsStore.defaults.model);
    }

    settingsModal.classList.add("hidden");
    settingsApiKeyError.classList.add("hidden");
    settingsApiKeyInput.classList.remove("field-error-state");
  });

  hydrate();
}
