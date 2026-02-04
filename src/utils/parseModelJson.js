export function parseModelJson(content) {
  if (content && typeof content === "object") {
    return content;
  }

  if (typeof content !== "string") {
    throw new Error("Model response is not a JSON string.");
  }

  let text = content.trim();

  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }

  const tryParse = (value) => {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== "object") {
      throw new Error("Model JSON is not an object.");
    }
    return parsed;
  };

  try {
    return tryParse(text);
  } catch (error) {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      const candidate = text.slice(firstBrace, lastBrace + 1);
      return tryParse(candidate);
    }
    throw error;
  }
}
