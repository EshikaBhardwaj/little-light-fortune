import { describe, it, expect } from "vitest";
import { FORTUNES, LINKS, pickFortune } from "./fortunes";

describe("agency destinations", () => {
  it("uses the supplied website", () => expect(LINKS.main).toBe("https://www.synergostech.com/"));
  it("uses the supplied portfolio", () => expect(LINKS.work).toBe("https://synergostech.com/portfolio/"));
  it("uses the supplied about page", () => expect(LINKS.about).toBe("https://www.synergostech.com/about-us/"));
});

describe("fortunes", () => {
  it("has at least 100 unique fortunes", () => {
    expect(new Set(FORTUNES.map((f) => f.text)).size).toBeGreaterThanOrEqual(100);
  });
  it("never repeats within a session", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 20; i++) {
      const f = pickFortune("sun", seen);
      expect(seen.has(f.id)).toBe(false);
      seen.add(f.id);
    }
  });
});
