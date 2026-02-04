import { createItineraryService } from "./itineraryService.js";
import { renderResults, hideError, showError, resetResults, setLoading } from "../ui/render.js";
import { generateICS } from "../domain/ics.js";
import { downloadFile } from "../utils/download.js";

export function createAppController({
  dom,
  settingsStore,
  providerFactory,
  imageInputController,
  apiKeyModal,
  settingsModal,
}) {
  let eventsData = [];

  const resetForm = () => {
    dom.textInput.value = "";
    imageInputController.clearImage();
    resetResults({
      resultsContainer: dom.resultsContainer,
      downloadContainer: dom.downloadContainer,
      loader: dom.loader,
    });
    hideError(dom.errorMessage);
    eventsData = [];
    dom.generateBtn.disabled = false;
    dom.generateBtn.classList.remove("btn-disabled");
  };

  dom.resetBtn.addEventListener("click", resetForm);

  dom.generateBtn.addEventListener("click", async () => {
    const providerName = settingsStore.getProvider();
    if (providerName === "openrouter") {
      const apiKey = settingsStore.getApiKey();
      if (!apiKey) {
        showError(dom.errorMessage, "Please set your OpenRouter API key first.");
        apiKeyModal.classList.remove("hidden");
        return;
      }
    } else {
      const providerKey = settingsStore.getCustomApiKey();
      const providerEndpoint = settingsStore.getCustomEndpoint();
      const providerModel = settingsStore.getCustomModel();
      if (!providerKey || !providerEndpoint || !providerModel) {
        showError(
          dom.errorMessage,
          "Please configure your provider settings first."
        );
        settingsModal.classList.remove("hidden");
        return;
      }
    }

    const text = dom.textInput.value.trim();
    const imageBase64 = imageInputController.getImageBase64();

    if (!text && !imageBase64) {
      showError(dom.errorMessage, "Please provide some text or upload an image.");
      return;
    }

    hideError(dom.errorMessage);
    resetResults({
      resultsContainer: dom.resultsContainer,
      downloadContainer: dom.downloadContainer,
      loader: dom.loader,
    });
    setLoading({ loader: dom.loader, generateBtn: dom.generateBtn }, true);

    try {
      const itineraryService = createItineraryService({
        provider: providerFactory(),
      });
      eventsData = await itineraryService.parseItinerary({
        text,
        imageBase64,
        locationHref: window.location.href,
      });

      const rendered = renderResults(
        {
          resultsContainer: dom.resultsContainer,
          downloadContainer: dom.downloadContainer,
        },
        eventsData
      );

      if (!rendered) {
        showError(dom.errorMessage, "Could not find any events in the provided input.");
      }
    } catch (error) {
      console.error("API call failed:", error);
      if (error.message.includes("Authentication failed")) {
        showError(dom.errorMessage, error.message);
        apiKeyModal.classList.remove("hidden");
      } else {
        showError(
          dom.errorMessage,
          "Failed to parse itinerary. Please check the input or try again."
        );
      }
    } finally {
      setLoading({ loader: dom.loader, generateBtn: dom.generateBtn }, false);
    }
  });

  dom.downloadBtn.addEventListener("click", () => {
    if (!eventsData || eventsData.length === 0) return;
    const icsContent = generateICS(eventsData);
    downloadFile(icsContent, "itinerary.ics", "text/calendar");
  });

  return {
    resetForm,
  };
}
