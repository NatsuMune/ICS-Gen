export function setupSettingsModal({
  settingsBtn,
  settingsModal,
  closeSettingsBtn,
  settingsProviderSelect,
  providerConfigFields,
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
  const toggleProviderFields = () => {
    const provider = settingsProviderSelect.value;
    if (provider === "openai-compatible") {
      providerConfigFields.classList.remove("hidden");
      openrouterConfigFields.classList.add("hidden");
    } else {
      providerConfigFields.classList.add("hidden");
      openrouterConfigFields.classList.remove("hidden");
    }
  };

  const hydrate = () => {
    settingsProviderSelect.value = settingsStore.getProvider();
    settingsApiKeyInput.value = settingsStore.getApiKey();
    settingsModelInput.value = settingsStore.getModel();
    settingsProviderEndpointInput.value = settingsStore.getCustomEndpoint();
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
    toggleProviderFields();
  });

  saveSettingsBtn.addEventListener("click", () => {
    const apiKey = settingsApiKeyInput.value.trim();
    const model = settingsModelInput.value.trim();
    const providerEndpoint = settingsProviderEndpointInput.value.trim();
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

    if (providerEndpoint) {
      settingsStore.setCustomEndpoint(providerEndpoint);
    } else {
      settingsStore.clearCustomEndpoint();
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
