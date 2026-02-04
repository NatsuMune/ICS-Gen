export function getDom() {
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
