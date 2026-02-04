import { getDom } from "./ui/dom.js";
import { createImageInputController } from "./ui/imageInput.js";
import { setupApiKeyModal } from "./ui/apiKeyModal.js";
import { setupSettingsModal } from "./ui/settingsModal.js";
import { createSettingsStore } from "./infrastructure/settingsStore.js";
import { createProvider } from "./infrastructure/providers/providerFactory.js";
import { createAppController } from "./app/controller.js";

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then(
      (registration) => {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      (err) => {
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const dom = getDom();
  const settingsStore = createSettingsStore();

  const imageInputController = createImageInputController({
    dropZone: dom.dropZone,
    imageUploadInput: dom.imageUploadInput,
    uploadPrompt: dom.uploadPrompt,
    imagePreviewContainer: dom.imagePreviewContainer,
    imagePreview: dom.imagePreview,
    imageName: dom.imageName,
    removeImageBtn: dom.removeImageBtn,
    textInput: dom.textInput,
  });

  setupApiKeyModal({
    apiKeyModal: dom.apiKeyModal,
    apiKeyInput: dom.apiKeyInput,
    saveApiKeyBtn: dom.saveApiKeyBtn,
    apiKeyError: dom.apiKeyError,
    settingsApiKeyInput: dom.settingsApiKeyInput,
    settingsStore,
  });

  setupSettingsModal({
    settingsBtn: dom.settingsBtn,
    settingsModal: dom.settingsModal,
    closeSettingsBtn: dom.closeSettingsBtn,
    settingsProviderSelect: dom.settingsProviderSelect,
    providerConfigFields: dom.providerConfigFields,
    openrouterConfigFields: dom.openrouterConfigFields,
    settingsProviderEndpointInput: dom.settingsProviderEndpointInput,
    settingsProviderApiKeyInput: dom.settingsProviderApiKeyInput,
    settingsProviderModelInput: dom.settingsProviderModelInput,
    settingsApiKeyInput: dom.settingsApiKeyInput,
    settingsModelInput: dom.settingsModelInput,
    saveSettingsBtn: dom.saveSettingsBtn,
    cancelSettingsBtn: dom.cancelSettingsBtn,
    settingsApiKeyError: dom.settingsApiKeyError,
    settingsStore,
  });

  const providerFactory = () =>
    createProvider({
      name: settingsStore.getProvider(),
      settingsStore,
    });

  createAppController({
    dom,
    settingsStore,
    providerFactory,
    imageInputController,
    apiKeyModal: dom.apiKeyModal,
    settingsModal: dom.settingsModal,
  });

  registerServiceWorker();
});
