import { buildItineraryPrompt } from "../../domain/itineraryPrompt.js";
import { parseModelJson } from "../../utils/parseModelJson.js";

const DEFAULT_ANTHROPIC_BASE_URL = "https://api.anthropic.com/v1";
const ANTHROPIC_VERSION = "2023-06-01";
const MAX_TOKENS = 4096;
const API_VERSION_PATH = "/v1";
const MESSAGES_PATH = "/messages";

export function buildAnthropicMessagesUrl(
  baseUrl = DEFAULT_ANTHROPIC_BASE_URL
) {
  const normalizedBaseUrl = (baseUrl || DEFAULT_ANTHROPIC_BASE_URL)
    .trim()
    .replace(/\/+$/, "");

  if (normalizedBaseUrl.endsWith(MESSAGES_PATH)) {
    return normalizedBaseUrl;
  }

  if (normalizedBaseUrl.endsWith(API_VERSION_PATH)) {
    return `${normalizedBaseUrl}${MESSAGES_PATH}`;
  }

  return `${normalizedBaseUrl}${API_VERSION_PATH}${MESSAGES_PATH}`;
}

function collectTextContent(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .filter((block) => block?.type === "text" && block.text)
    .map((block) => block.text)
    .join("\n");
}

export function createAnthropicProvider({
  fetchImpl = window.fetch.bind(window),
  settingsStore,
  nowProvider = () => new Date(),
} = {}) {
  if (!settingsStore) {
    throw new Error("settingsStore is required");
  }

  const name = "anthropic";

  async function parseItinerary({ text, imageBase64 }) {
    const apiKey = settingsStore.getCustomApiKey();
    const model = settingsStore.getCustomModel();
    const baseUrl = settingsStore.getAnthropicBaseUrl?.() || "";

    if (!apiKey) {
      throw new Error("Anthropic API key is not configured.");
    }

    if (!model) {
      throw new Error("Anthropic model is not configured.");
    }

    const userContent = [];
    if (text) userContent.push({ type: "text", text });
    if (imageBase64) {
      userContent.push({
        type: "image",
        source: {
          type: "base64",
          media_type: "image/jpeg",
          data: imageBase64,
        },
      });
    }

    const payload = {
      model,
      max_tokens: MAX_TOKENS,
      system: buildItineraryPrompt(nowProvider()),
      messages: [{ role: "user", content: userContent }],
    };

    const response = await fetchImpl(buildAnthropicMessagesUrl(baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication failed. Please verify your Anthropic API key.");
      }
      const errorBody = await response.text();
      throw new Error(
        `API request failed with status ${response.status}: ${errorBody}`
      );
    }

    const result = await response.json();
    const jsonText = collectTextContent(result.content);

    if (!jsonText) {
      throw new Error("Anthropic returned no JSON content.");
    }

    try {
      const parsedData = parseModelJson(jsonText);
      return parsedData.events || [];
    } catch (error) {
      console.error("Failed to parse Anthropic JSON:", error, jsonText);
      throw new Error("Anthropic returned invalid JSON. Please try again.");
    }
  }

  return {
    name,
    parseItinerary,
  };
}
