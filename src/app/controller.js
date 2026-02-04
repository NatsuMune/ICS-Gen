import { createItineraryService } from "./itineraryService.js";
import { renderResults, hideError, showError, resetResults, setLoading } from "../ui/render.js";
import { generateICS } from "../domain/ics.js";
import { downloadFile } from "../utils/download.js";

const DEFAULT_ICS_FILE_NAME = "itinerary.ics";
const TUTORIAL_DISMISSED_KEY = "icsgen_tutorial_dismissed";
const INPUT_MODE_TEXT = "text";
const INPUT_MODE_IMAGE = "image";

function getDatePart(value) {
  if (!value || typeof value !== "string") return "";
  const [date] = value.split("T");
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "";
}

function buildIcsFileName(events) {
  if (!Array.isArray(events) || events.length === 0) {
    return DEFAULT_ICS_FILE_NAME;
  }

  const sorted = [...events].sort((a, b) =>
    String(a.dtstart || "").localeCompare(String(b.dtstart || ""))
  );
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const startDate = getDatePart(first?.dtstart);
  const endDate = getDatePart(last?.dtend || last?.dtstart);

  if (startDate && endDate && startDate !== endDate) {
    return `itinerary-${startDate}-to-${endDate}.ics`;
  }
  if (startDate || endDate) {
    return `itinerary-${startDate || endDate}.ics`;
  }
  return DEFAULT_ICS_FILE_NAME;
}

export function createAppController({
  dom,
  settingsStore,
  providerFactory,
  imageInputController,
  apiKeyModal,
  settingsModal,
}) {
  let eventsData = [];
  let inputMode = INPUT_MODE_TEXT;

  const setInputMode = (mode) => {
    if (mode !== INPUT_MODE_TEXT && mode !== INPUT_MODE_IMAGE) return;
    inputMode = mode;
    const isText = mode === INPUT_MODE_TEXT;
    dom.textInputPanel.classList.toggle("hidden", !isText);
    dom.imageInputPanel.classList.toggle("hidden", isText);
    dom.modeTextBtn.classList.toggle("is-active", isText);
    dom.modeImageBtn.classList.toggle("is-active", !isText);
  };

  const showTutorial = () => {
    dom.hero.classList.remove("hidden");
    dom.appShell.classList.remove("tutorial-dismissed");
    dom.hero.classList.add("fade-in");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const dismissTutorial = () => {
    dom.hero.classList.add("hidden");
    dom.appShell.classList.add("tutorial-dismissed");
    window.localStorage.setItem(TUTORIAL_DISMISSED_KEY, "true");
  };

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

  const tutorialDismissed =
    window.localStorage.getItem(TUTORIAL_DISMISSED_KEY) === "true";
  if (tutorialDismissed) {
    dom.hero.classList.add("hidden");
    dom.appShell.classList.add("tutorial-dismissed");
  }

  dom.helpBtn.addEventListener("click", showTutorial);
  dom.dismissHeroBtn.addEventListener("click", dismissTutorial);

  dom.modeTextBtn.addEventListener("click", () => setInputMode(INPUT_MODE_TEXT));
  dom.modeImageBtn.addEventListener("click", () => setInputMode(INPUT_MODE_IMAGE));
  setInputMode(INPUT_MODE_TEXT);

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

    if (inputMode === INPUT_MODE_TEXT && !text) {
      showError(dom.errorMessage, "Please paste your itinerary text.");
      return;
    }

    if (inputMode === INPUT_MODE_IMAGE && !imageBase64) {
      showError(dom.errorMessage, "Please upload an itinerary image.");
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
        text: inputMode === INPUT_MODE_TEXT ? text : "",
        imageBase64: inputMode === INPUT_MODE_IMAGE ? imageBase64 : null,
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
      } else if (error.message.includes("Model returned")) {
        showError(dom.errorMessage, error.message);
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
    const fileName = buildIcsFileName(eventsData);
    downloadFile(icsContent, fileName, "text/calendar");
  });

  return {
    resetForm,
  };
}
