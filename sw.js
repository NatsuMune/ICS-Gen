const CACHE_NAME = "itinerary-assistant-v3";
const urlsToCache = [
  "/",
  "/index.html",
  "/styles/app.css",
  "/src/main.js",
  "/src/app/controller.js",
  "/src/app/itineraryService.js",
  "/src/domain/ics.js",
  "/src/domain/itineraryPrompt.js",
  "/src/infrastructure/settingsStore.js",
  "/src/infrastructure/providers/openrouterProvider.js",
  "/src/infrastructure/providers/openaiCompatibleProvider.js",
  "/src/infrastructure/providers/providerFactory.js",
  "/src/ui/apiKeyModal.js",
  "/src/ui/dom.js",
  "/src/ui/imageInput.js",
  "/src/ui/render.js",
  "/src/ui/settingsModal.js",
  "/src/utils/download.js",
  "https://cdn.tailwindcss.com",
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
