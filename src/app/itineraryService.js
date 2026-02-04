export function createItineraryService({ provider }) {
  return {
    async parseItinerary({ text, imageBase64, locationHref }) {
      return provider.parseItinerary({ text, imageBase64, locationHref });
    },
  };
}
