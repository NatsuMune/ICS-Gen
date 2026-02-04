import { describe, it, expect } from "vitest";
import { generateICS } from "../../src/domain/ics.js";

describe("generateICS", () => {
  it("renders calendar content with escaped fields", () => {
    const events = [
      {
        summary: "Hello;World, test",
        dtstart: "2025-01-02T03:04:05",
        start_timezone: "America/New_York",
        dtend: "2025-01-02T05:04:05",
        end_timezone: "America/New_York",
        location: "JFK, New York, NY",
        description: "Line one\nLine two",
      },
    ];

    const ics = generateICS(events);

    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("DTSTART;TZID=America/New_York:20250102T030405");
    expect(ics).toContain("DTEND;TZID=America/New_York:20250102T050405");
    expect(ics).toContain("SUMMARY:Hello\\;World\\, test");
    expect(ics).toContain("DESCRIPTION:Line one\\nLine two");
    expect(ics).toContain("LOCATION:JFK\\, New York\\, NY");
    expect(ics).toContain("END:VCALENDAR");
  });
});
