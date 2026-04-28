import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("app CSS", () => {
  it("keeps responsive utility buttons out of the hero content", () => {
    const css = readFileSync("styles/app.css", "utf8");
    const tabletStart = css.indexOf("@media (max-width: 1180px)");
    const narrowStart = css.indexOf("@media (max-width: 980px)");
    const mobileStart = css.indexOf("@media (max-width: 640px)");
    const tabletStyles = css.slice(tabletStart, narrowStart);
    const narrowStyles = css.slice(narrowStart, mobileStart);
    const nextMediaStart = css.indexOf("@media", mobileStart + 1);
    const mobileStyles = css.slice(mobileStart, nextMediaStart);

    expect(tabletStyles).toContain(
      "--responsive-top-clearance: max(56px, calc(24px + env(safe-area-inset-top)));",
    );
    expect(tabletStyles).toContain(
      "--utility-button-inset-right: max(32px, calc(24px + env(safe-area-inset-right)));",
    );
    expect(tabletStyles).toContain("padding: var(--responsive-top-clearance)");
    expect(tabletStyles).toContain("margin-top: 104px;");
    expect(tabletStyles).toContain("min-width: 0;");
    expect(tabletStyles).toContain("width: 100%;");
    expect(tabletStyles).toContain("position: fixed;");
    expect(tabletStyles).toContain("top: var(--responsive-top-clearance);");
    expect(tabletStyles).toContain("right: var(--utility-button-inset-right);");
    expect(tabletStyles).toContain("width: 48px;");
    expect(tabletStyles).toContain("height: 48px;");

    expect(narrowStyles).toContain("grid-template-columns: 1fr;");

    expect(mobileStyles).toContain(
      "--responsive-top-clearance: max(56px, calc(18px + env(safe-area-inset-top)));",
    );
  });
});
