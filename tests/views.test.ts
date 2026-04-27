// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { describe, expect, it } from "vitest";

import { formatViewCount } from "../src/lib/views";

describe("formatViewCount", () => {
  it("formats singular view", () => {
    expect(formatViewCount(1)).toBe("1 view");
  });

  it("formats plural views", () => {
    expect(formatViewCount(0)).toBe("0 views");
    expect(formatViewCount(42)).toBe("42 views");
  });

  it("formats thousands with k suffix", () => {
    expect(formatViewCount(1_247)).toBe("1.2k views");
    expect(formatViewCount(1_000)).toBe("1.0k views");
  });

  it("formats millions with M suffix", () => {
    expect(formatViewCount(2_500_000)).toBe("2.5M views");
  });
});
