export function setupApiKeyModal({
  apiKeyModal,
  apiProviderSelect,
  apiOpenrouterConfigFields,
  apiProviderConfigFields,
  apiProviderEndpointGroup,
  apiProviderEndpointInput,
  apiProviderApiKeyInput,
  apiProviderModelInput,
  apiKeyInput,
  apiModelInput,
  saveApiKeyBtn,
  apiKeyError,
  settingsApiKeyInput,
  settingsModelInput,
  settingsProviderSelect,
  settingsProviderEndpointInput,
  settingsProviderApiKeyInput,
  settingsProviderModelInput,
  settingsStore,
}) {
  const providerCopy = {
    "openai-compatible": {
      endpointLabel: "Provider Base URL (optional)",
      endpointPlaceholder: "https://api.openai.com/v1",
      apiKeyLabel: "Provider API Key",
      apiKeyPlaceholder: "sk-...",
      modelLabel: "Provider Model",
      modelPlaceholder: "gpt-4o-mini",
    },
    anthropic: {
      endpointLabel: "Anthropic Base URL (optional)",
      endpointPlaceholder: "https://api.anthropic.com/v1",
      apiKeyLabel: "Anthropic API Key",
      apiKeyPlaceholder: "sk-ant-...",
      modelLabel: "Anthropic Model",
      modelPlaceholder: "claude-sonnet-4-5",
    },
  };

  const setLabelText = (forAttribute, text) => {
    const label = document.querySelector(`label[for="${forAttribute}"]`);
    if (label) label.textContent = text;
  };

  const getEndpointValueForProvider = (provider) => {
    if (provider === "anthropic") {
      return settingsStore.getAnthropicBaseUrl?.() || "";
    }
    return settingsStore.getCustomBaseUrl();
  };

  const isCurrentProviderConfigured = () => {
    const provider = settingsStore.getProvider();
    if (provider === "openrouter") {
      return Boolean(settingsStore.getApiKey());
    }
    return Boolean(settingsStore.getCustomApiKey() && settingsStore.getCustomModel());
  };

  const clearValidation = () => {
    apiKeyError.classList.add("hidden");
    apiKeyError.textContent = "";
    apiKeyInput.classList.remove("field-error-state");
    apiProviderApiKeyInput.classList.remove("field-error-state");
    apiProviderModelInput.classList.remove("field-error-state");
  };

  const toggleProviderFields = () => {
    const provider = apiProviderSelect.value;
    clearValidation();
    if (provider === "openai-compatible" || provider === "anthropic") {
      const copy = providerCopy[provider];
      apiProviderConfigFields.classList.remove("hidden");
      apiOpenrouterConfigFields.classList.add("hidden");
      apiProviderEndpointGroup?.classList.remove("hidden");
      apiProviderEndpointInput.placeholder = copy.endpointPlaceholder;
      apiProviderApiKeyInput.placeholder = copy.apiKeyPlaceholder;
      apiProviderModelInput.placeholder = copy.modelPlaceholder;
      setLabelText("api-provider-endpoint-input", copy.endpointLabel);
      setLabelText("api-provider-api-key-input", copy.apiKeyLabel);
      setLabelText("api-provider-model-input", copy.modelLabel);
      apiProviderEndpointInput.value = getEndpointValueForProvider(provider);
      return;
    }

    apiProviderConfigFields.classList.add("hidden");
    apiOpenrouterConfigFields.classList.remove("hidden");
  };

  const hydrate = () => {
    apiProviderSelect.value = settingsStore.getProvider();
    apiKeyInput.value = settingsStore.getApiKey();
    apiModelInput.value = settingsStore.getModel();
    apiProviderEndpointInput.value = getEndpointValueForProvider(
      apiProviderSelect.value
    );
    apiProviderApiKeyInput.value = settingsStore.getCustomApiKey();
    apiProviderModelInput.value = settingsStore.getCustomModel();
    toggleProviderFields();
  };

  hydrate();

  if (!isCurrentProviderConfigured()) {
    apiKeyModal.classList.remove("hidden");
  }

  apiProviderSelect.addEventListener("change", toggleProviderFields);

  saveApiKeyBtn.addEventListener("click", () => {
    const provider = apiProviderSelect.value;
    const key = apiKeyInput.value.trim();
    const model = apiModelInput.value.trim();
    const providerBaseUrl = apiProviderEndpointInput.value.trim();
    const providerApiKey = apiProviderApiKeyInput.value.trim();
    const providerModel = apiProviderModelInput.value.trim();

    clearValidation();

    if (provider === "openrouter") {
      if (!settingsStore.isApiKeyValid(key)) {
        apiKeyError.textContent = "Please enter a valid OpenRouter API key.";
        apiKeyError.classList.remove("hidden");
        apiKeyInput.classList.add("field-error-state");
        return;
      }

      settingsStore.setProvider(provider);
      settingsStore.setApiKey(key);
      settingsStore.setModel(model || settingsStore.defaults.model);
      settingsApiKeyInput.value = key;
      settingsModelInput.value = settingsStore.getModel();
      settingsProviderSelect.value = provider;
      apiKeyModal.classList.add("hidden");
      return;
    }

    if (!providerApiKey || !providerModel) {
      apiKeyError.textContent = "Please enter a provider API key and model.";
      apiKeyError.classList.remove("hidden");
      apiProviderApiKeyInput.classList.toggle(
        "field-error-state",
        !providerApiKey
      );
      apiProviderModelInput.classList.toggle(
        "field-error-state",
        !providerModel
      );
      return;
    }

    settingsStore.setProvider(provider);
    if (provider === "anthropic") {
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
    settingsStore.setCustomApiKey(providerApiKey);
    settingsStore.setCustomModel(providerModel);

    settingsProviderSelect.value = provider;
    settingsProviderEndpointInput.value = providerBaseUrl;
    settingsProviderApiKeyInput.value = providerApiKey;
    settingsProviderModelInput.value = providerModel;
    apiKeyModal.classList.add("hidden");
  });
}
