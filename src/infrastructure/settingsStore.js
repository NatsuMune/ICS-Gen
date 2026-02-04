const API_KEY_STORAGE_KEY = "openrouter_api_key";
const MODEL_STORAGE_KEY = "openrouter_model";
const PROVIDER_STORAGE_KEY = "ai_provider";
const CUSTOM_API_KEY_STORAGE_KEY = "provider_api_key";
const CUSTOM_MODEL_STORAGE_KEY = "provider_model";
const CUSTOM_ENDPOINT_STORAGE_KEY = "provider_endpoint";
const DEFAULT_MODEL = "nvidia/nemotron-nano-12b-v2-vl:free";
const DEFAULT_PROVIDER = "openrouter";

export function createSettingsStore(storage = window.localStorage) {
  const getApiKey = () => storage.getItem(API_KEY_STORAGE_KEY) || "";
  const setApiKey = (key) => storage.setItem(API_KEY_STORAGE_KEY, key);
  const clearApiKey = () => storage.removeItem(API_KEY_STORAGE_KEY);
  const isApiKeyValid = (key) => key.startsWith("sk-or-v1-");

  const getModel = () => storage.getItem(MODEL_STORAGE_KEY) || DEFAULT_MODEL;
  const setModel = (model) => storage.setItem(MODEL_STORAGE_KEY, model);

  const getProvider = () => storage.getItem(PROVIDER_STORAGE_KEY) || DEFAULT_PROVIDER;
  const setProvider = (providerName) =>
    storage.setItem(PROVIDER_STORAGE_KEY, providerName);

  const getCustomApiKey = () => storage.getItem(CUSTOM_API_KEY_STORAGE_KEY) || "";
  const setCustomApiKey = (key) => storage.setItem(CUSTOM_API_KEY_STORAGE_KEY, key);
  const clearCustomApiKey = () => storage.removeItem(CUSTOM_API_KEY_STORAGE_KEY);

  const getCustomModel = () => storage.getItem(CUSTOM_MODEL_STORAGE_KEY) || "";
  const setCustomModel = (model) =>
    storage.setItem(CUSTOM_MODEL_STORAGE_KEY, model);
  const clearCustomModel = () => storage.removeItem(CUSTOM_MODEL_STORAGE_KEY);

  const getCustomEndpoint = () =>
    storage.getItem(CUSTOM_ENDPOINT_STORAGE_KEY) || "";
  const setCustomEndpoint = (endpoint) =>
    storage.setItem(CUSTOM_ENDPOINT_STORAGE_KEY, endpoint);
  const clearCustomEndpoint = () =>
    storage.removeItem(CUSTOM_ENDPOINT_STORAGE_KEY);

  return {
    getApiKey,
    setApiKey,
    clearApiKey,
    isApiKeyValid,
    getModel,
    setModel,
    getProvider,
    setProvider,
    getCustomApiKey,
    setCustomApiKey,
    clearCustomApiKey,
    getCustomModel,
    setCustomModel,
    clearCustomModel,
    getCustomEndpoint,
    setCustomEndpoint,
    clearCustomEndpoint,
    defaults: {
      model: DEFAULT_MODEL,
      provider: DEFAULT_PROVIDER,
    },
  };
}
