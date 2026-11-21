// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const config = JSON.parse(readFileSync(new URL("../.oxlintrc.json", import.meta.url), "utf8")) as {
  rules: Record<string, unknown>;
};

describe("oxlint config", () => {
  it("rejects functions above ten decision paths", () => {
    expect(config.rules.complexity).toEqual(["error", { max: 10, variant: "modified" }]);
  });
});
