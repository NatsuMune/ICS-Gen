export function setupApiKeyModal({
  apiKeyModal,
  apiKeyInput,
  saveApiKeyBtn,
  apiKeyError,
  settingsApiKeyInput,
  settingsStore,
}) {
  const storedKey = settingsStore.getApiKey();
  if (!storedKey) {
    apiKeyModal.classList.remove("hidden");
  }

  saveApiKeyBtn.addEventListener("click", () => {
    const key = apiKeyInput.value.trim();
    if (settingsStore.isApiKeyValid(key)) {
      settingsStore.setApiKey(key);
      settingsApiKeyInput.value = key;
      apiKeyModal.classList.add("hidden");
      apiKeyError.classList.add("hidden");
      apiKeyInput.classList.remove("field-error-state");
      return;
    }

    apiKeyError.classList.remove("hidden");
    apiKeyInput.classList.add("field-error-state");
  });
}
