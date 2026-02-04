import { buildItineraryPrompt } from "../../domain/itineraryPrompt.js";
import { parseModelJson } from "../../utils/parseModelJson.js";

export function createOpenRouterProvider({
  fetchImpl = window.fetch.bind(window),
  settingsStore,
  nowProvider = () => new Date(),
} = {}) {
  if (!settingsStore) {
    throw new Error("settingsStore is required");
  }

  const name = "openrouter";
  const apiUrl = "https://openrouter.ai/api/v1/chat/completions";

  async function parseItinerary({ text, imageBase64, locationHref }) {
    const apiKey = settingsStore.getApiKey();
    const model = settingsStore.getModel();
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
      reasoning: { effort: "none" },
      plugins: [{ id: "response-healing" }],
    };

    const response = await fetchImpl(apiUrl, {
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
        settingsStore.clearApiKey();
        throw new Error(
          "Authentication failed. Your API key is invalid. Please enter a valid one."
        );
      }
      const errorBody = await response.text();
      throw new Error(
        `API request failed with status ${response.status}: ${errorBody}`
      );
    }

    const result = await response.json();

    const message = result.choices?.[0]?.message;
    if (message) {
      let jsonText = message.content;

      if (!jsonText && message.reasoning) {
        jsonText = message.reasoning;
      }

      if (!jsonText && Array.isArray(message.reasoning_details)) {
        jsonText = message.reasoning_details
          .map((detail) => detail.text || "")
          .join("\n");
      }

      if (!jsonText) {
        throw new Error(
          "Model returned no JSON content. Try a different model or disable reasoning mode."
        );
      }

      try {
        const parsedData = parseModelJson(jsonText);
        return parsedData.events || [];
      } catch (error) {
        console.error("Failed to parse model JSON:", error, jsonText);
        throw new Error(
          "Model did not return valid JSON. Try a different model or disable reasoning mode."
        );
      }
    }

    throw new Error("Provider returned an unexpected response shape.");
  }

  return {
    name,
    parseItinerary,
  };
}
