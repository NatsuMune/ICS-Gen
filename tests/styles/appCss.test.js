import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("app CSS", () => {
  it("keeps mobile utility buttons inset from screen edges", () => {
    const css = readFileSync("styles/app.css", "utf8");
    const mobileStart = css.indexOf("@media (max-width: 640px)");
    const nextMediaStart = css.indexOf("@media", mobileStart + 1);
    const mobileStyles = css.slice(mobileStart, nextMediaStart);

    expect(mobileStyles).toContain("top: calc(24px + env(safe-area-inset-top));");
    expect(mobileStyles).toContain("right: calc(24px + env(safe-area-inset-right));");
    expect(mobileStyles).toContain("width: 48px;");
    expect(mobileStyles).toContain("height: 48px;");
  });
});
