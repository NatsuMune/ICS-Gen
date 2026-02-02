# AGENTS.md

## Project overview
ICS-Gen is a static web app that converts travel itineraries (text or images) into `.ics` calendar files. The UI is built in `index.html` with Tailwind via CDN and vanilla JavaScript. Static assets include the PWA manifest and service worker.

## Repo layout
- `index.html`: Main UI, styles, and application logic (Tailwind + JS).
- `manifest.json`: PWA manifest metadata.
- `sw.js`: Service worker for offline support.
- `icons/`: App icons.

## How to run
Open `index.html` directly in a modern browser. No build step is required.

## Developer notes
- Keep changes compatible with a static hosting environment (no build tooling).
- Prefer minimal dependencies (Tailwind is loaded via CDN).
- If you touch UI behavior or styles, verify in a browser.

## Testing
No automated tests are configured. Perform manual verification in the browser as needed.
