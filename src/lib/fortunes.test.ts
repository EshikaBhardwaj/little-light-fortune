import { describe, it, expect } from "vitest";
import { FORTUNES, pickFortune } from "./fortunes";

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
