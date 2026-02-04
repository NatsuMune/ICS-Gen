import { buildItineraryPrompt } from "../../domain/itineraryPrompt.js";
import { parseModelJson } from "../../utils/parseModelJson.js";

export function createOpenAICompatibleProvider({
  fetchImpl = window.fetch.bind(window),
  settingsStore,
  nowProvider = () => new Date(),
} = {}) {
  if (!settingsStore) {
    throw new Error("settingsStore is required");
  }

  const name = "openai-compatible";

  async function parseItinerary({ text, imageBase64, locationHref }) {
    const apiKey = settingsStore.getCustomApiKey();
    const model = settingsStore.getCustomModel();
    const endpoint = settingsStore.getCustomEndpoint();

    if (!endpoint) {
      throw new Error("Provider endpoint is not configured.");
    }

    if (!apiKey) {
      throw new Error("Provider API key is not configured.");
    }

    if (!model) {
      throw new Error("Provider model is not configured.");
    }

    const nowValue = nowProvider();
    const systemPrompt = buildItineraryPrompt(nowValue);

    const userContent = [];
    if (text) userContent.push({ type: "text", text });
    if (imageBase64) {
      userContent.push({
        type: "image_url",
        image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
      });
    }

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ];

    const payload = {
      model,
      messages,
      response_format: { type: "json_object" },
    };

    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": locationHref || window.location.href,
        "X-Title": "ICS-Gen",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication failed. Please verify your provider API key.");
      }
      const errorBody = await response.text();
      throw new Error(
        `API request failed with status ${response.status}: ${errorBody}`
      );
    }

    const result = await response.json();

    if (result.choices?.[0]?.message?.content) {
      const jsonText = result.choices[0].message.content;
      try {
        const parsedData = parseModelJson(jsonText);
        return parsedData.events || [];
      } catch (error) {
        console.error("Failed to parse model JSON:", error, jsonText);
        throw new Error("Provider returned invalid JSON. Please try again.");
      }
    }

    throw new Error("Unexpected API response structure.");
  }

  return {
    name,
    parseItinerary,
  };
}
