# ICS-Gen

**Instantly convert your travel plans from text or images into calendar events.**

ICS-Gen is a smart, intuitive web application that parses travel itineraries—whether pasted as text or uploaded as an image—and converts them into downloadable `.ics` calendar files. Built with a sleek, modern interface, it leverages AI to intelligently extract event details, saving you the hassle of manual calendar entry.

## ✨ Key Features

- **Dual Input Modes:** Paste raw text or upload an image (e.g., a screenshot of a booking confirmation).
- **Intelligent Parsing:** Uses a configured AI provider to identify event details like summaries, dates, times, locations, and timezones.
- **.ics File Generation:** Creates a universally compatible `.ics` file that can be imported into Google Calendar, Apple Calendar, Outlook, and other calendar applications.
- **Progressive Web App (PWA):** Installable on both desktop and mobile devices for a native app-like experience and offline access.
- **Secure Provider Storage:** Stores provider, API key, model, and OpenAI-compatible base URL settings in your browser's local storage.
- **Modern, Responsive UI:** A clean, glassmorphism-inspired design that looks great on any device.

## 🚀 How It Works

ICS-Gen streamlines the process of calendar creation into three simple steps:

1.  **Input:** The user provides an itinerary by pasting text or uploading an image.
2.  **Process:** The app sends the input to the Gemini API with a specialized prompt designed to extract event information into a structured JSON format.
3.  **Output:** The extracted events are displayed for review and can be downloaded as a single `.ics` file, ready for import.

The front-end is built with **HTML**, **Tailwind CSS**, and vanilla **JavaScript**, ensuring it is lightweight and fast.

## 🏁 Getting Started

To run ICS-Gen locally, follow these steps:

**Prerequisites:**

- A modern web browser (Chrome, Firefox, Safari, Edge).
- An API key from [OpenRouter](https://openrouter.ai/ "null") or another OpenAI-compatible provider.

**Setup:**

1.  Clone this repository or download the source files.
2.  Open the `index.html` file in your web browser.
3.  On the first launch, a modal will appear. Enter your OpenRouter API key to activate the application's features. The key will be saved in local storage for future sessions.

To use an OpenAI-compatible provider, open settings, select **OpenAI-Compatible**, and enter the provider base URL, API key, and model. Use the base URL only, such as `https://api.example.com/v1`; ICS-Gen appends `/chat/completions` when it sends requests.

## 🧪 Development (Bun)

1.  Install dependencies: `bun install`
2.  Run tests: `bun run test`
3.  Serve locally: `bun run serve`
4.  Open `http://localhost:3000/` in your browser.

## penggunaan

1.  **Paste Text or Upload Image:**

    - Copy your itinerary text (e.g., from an email or document) and paste it into the text area.
    - Alternatively, drag and drop or click to upload a screenshot of your itinerary.

2.  **Generate Events:**

    - Click the "Generate .ics File" button. The app will process the input and display the extracted calendar events.

3.  **Download:**

    - Review the events.
    - Click the "Download All Events (.ics)" button to save the calendar file to your device.

4.  **Import:**

    - Open your preferred calendar application (Google Calendar, etc.) and use its "Import" function to add the downloaded `.ics` file.

## 📲 PWA Installation

For faster access, you can install ICS-Gen on your device:

- **Desktop:** Look for the install icon (usually a computer with a down arrow) in the address bar of your browser.
- **Mobile:** Open the browser menu and select "Add to Home Screen" or "Install App."

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](https://www.google.com/search?q=LICENSE "null") file for details.
