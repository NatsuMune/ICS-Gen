export function generateICS(events) {
  const toICSDate = (dateString) =>
    dateString ? dateString.replace(/[-:]/g, "") : "";
  const escapeICS = (str) =>
    str
      ? str
          .replace(/\\/g, "\\\\")
          .replace(/;/g, "\\;")
          .replace(/,/g, "\\,")
          .replace(/\n/g, "\\n")
      : "";
  const dtstamp =
    new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const eventStrings = events.map((data) => {
    const uid = `${Date.now()}-${Math.random()}@itinerary-app.com`;
    return [
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;TZID=${data.start_timezone}:${toICSDate(data.dtstart)}`,
      `DTEND;TZID=${data.end_timezone}:${toICSDate(data.dtend)}`,
      `SUMMARY:${escapeICS(data.summary)}`,
      `DESCRIPTION:${escapeICS(data.description)}`,
      `LOCATION:${escapeICS(data.location)}`,
      "END:VEVENT",
    ].join("\r\n");
  });

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ICS-Gen//EN",
    ...eventStrings,
    "END:VCALENDAR",
  ].join("\r\n");
}
