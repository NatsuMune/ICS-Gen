const CACHE_NAME = "itinerary-assistant-v21";
const urlsToCache = [
  "./",
  "./index.html",
  "./styles/app.css?v=21",
  "./src/main.js",
  "./src/app/controller.js",
  "./src/app/itineraryService.js",
  "./src/domain/ics.js",
  "./src/domain/itineraryPrompt.js",
  "./src/infrastructure/settingsStore.js",
  "./src/infrastructure/providers/openrouterProvider.js",
  "./src/infrastructure/providers/openaiCompatibleProvider.js",
  "./src/infrastructure/providers/anthropicProvider.js",
  "./src/infrastructure/providers/providerFactory.js",
  "./src/ui/apiKeyModal.js",
  "./src/ui/dom.js",
  "./src/ui/imageInput.js",
  "./src/ui/render.js",
  "./src/ui/settingsModal.js",
  "./src/utils/download.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return null;
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
